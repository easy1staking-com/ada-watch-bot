"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useWallet } from "@/components/WalletContext";
import StatusBanner from "@/components/StatusBanner";
import { classifyError, FriendlyError } from "@/lib/errors";
import { useMarkets } from "@/lib/markets";
import {
  MARKETS,
  DecodedVault,
  decodeStrategyOrderDatum,
} from "@/lib/sundae";

interface LiveVault {
  txHash: string;
  outputIndex: number;
  lovelace: bigint;
  tokens: { unit: string; quantity: bigint }[];
  decoded: DecodedVault;
}

const ada = (l: bigint) => (Number(l) / 1_000_000).toLocaleString(undefined, { maximumFractionDigits: 2 });

function tokenLabel(unit: string, quantity: bigint): string {
  const market = MARKETS.find((m) => m.policyId + m.assetNameHex === unit);
  if (!market) return `${quantity} ${unit.slice(0, 8)}…`;
  const amount = market.decimals
    ? (Number(quantity) / 10 ** market.decimals).toLocaleString()
    : quantity.toLocaleString();
  return `${amount} ${market.name}`;
}

const ORDER_REF_SCRIPT_TX_HASH = "f5f1bdfad3eb4d67d2fc36f36f47fc2938cf6f001689184ab320735a28642cf2";
const CANCEL_REDEEMER_CBOR = "d87a80";

export default function VaultList() {
  const { client, address } = useWallet();
  const { markets } = useMarkets();
  const [vaults, setVaults] = useState<LiveVault[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<FriendlyError | null>(null);
  const [cancelling, setCancelling] = useState<string | null>(null);
  const [cancelled, setCancelled] = useState<string | null>(null);
  // two-step inline confirm: first tap arms the button, second tap fires; auto-disarms
  const [armed, setArmed] = useState<string | null>(null);
  const disarmTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const arm = useCallback((ref: string) => {
    setArmed(ref);
    if (disarmTimer.current) clearTimeout(disarmTimer.current);
    disarmTimer.current = setTimeout(() => setArmed(null), 6_000);
  }, []);

  const refresh = useCallback(async () => {
    if (!client || !address) return;
    setLoading(true);
    setError(null);
    try {
      const { orderAddressFor } = await import("@/lib/evolution");
      const { orderAddress } = orderAddressFor(address);

      const res = await fetch(`/api/vaults?address=${orderAddress}`);
      if (!res.ok) throw new Error(`vault lookup failed (${res.status})`);
      const utxos: {
        tx_hash: string;
        output_index: number;
        amount: { unit: string; quantity: string }[];
        inline_datum: string | null;
      }[] = await res.json();

      const found: LiveVault[] = [];
      for (const u of utxos) {
        if (!u.inline_datum) continue;
        const decoded = decodeStrategyOrderDatum(u.inline_datum);
        if (!decoded) continue;
        found.push({
          txHash: u.tx_hash,
          outputIndex: u.output_index,
          lovelace: BigInt(u.amount.find((a) => a.unit === "lovelace")?.quantity ?? "0"),
          tokens: u.amount
            .filter((a) => a.unit !== "lovelace")
            .map((a) => ({ unit: a.unit, quantity: BigInt(a.quantity) })),
          decoded,
        });
      }
      setVaults(found);
    } catch (e) {
      setError(classifyError(e));
    } finally {
      setLoading(false);
    }
  }, [client, address]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const cancelVault = useCallback(async (v: LiveVault) => {
    if (!client || !address) return;
    const ref = `${v.txHash}#${v.outputIndex}`;
    setArmed(null);
    setCancelling(ref);
    setError(null);
    try {
      const { stakeKeyOf, outRef, redeemerFromCbor, txHashHex } = await import("@/lib/evolution");

      // resolve the vault UTxO and the on-chain order reference script via the provider
      const [vaultUtxo] = await client.getUtxosByOutRef([outRef(v.txHash, v.outputIndex)]);
      const [refScriptUtxo] = await client.getUtxosByOutRef([outRef(ORDER_REF_SCRIPT_TX_HASH, 0)]);
      if (!vaultUtxo) throw new Error("Vault UTxO not found on-chain (already cancelled or executed?)");
      if (!refScriptUtxo) throw new Error("Sundae order reference script not found on-chain");

      // owner cancel: spend the order UTxO with the Cancel redeemer, signed by the
      // stake key named in the datum; collateral is selected automatically
      const built = await client
        .newTx()
        .readFrom({ referenceInputs: [refScriptUtxo] })
        .collectFrom({
          inputs: [vaultUtxo],
          redeemer: redeemerFromCbor(CANCEL_REDEEMER_CBOR),
          label: "cancel-vault",
        })
        .addSigner({ keyHash: stakeKeyOf(address) })
        // ledger needs collateral >= 150% of the fee (~0.4 ada here); the SDK default
        // targets 5 ada which shuts out small wallets — 1 ada is ample headroom
        .build({ setCollateral: 1_000_000n });

      const txHash = txHashHex(await (await built.sign()).submit());
      setCancelled(txHash);
      setVaults((prev) => prev?.filter((x) => `${x.txHash}#${x.outputIndex}` !== ref) ?? null);
    } catch (e) {
      setError(classifyError(e));
    } finally {
      setCancelling(null);
    }
  }, [client, address]);

  if (!client) {
    return (
      <div className="glass rounded-3xl p-6 text-center text-white/45 text-sm">
        Connect your wallet (top-right) to see your live vaults.
      </div>
    );
  }

  return (
    <div className="glass rounded-3xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-extrabold text-white">Your vaults</h2>
        <button onClick={refresh} disabled={loading}
          className="glass text-xs font-bold px-3 py-1.5 rounded-full hover:bg-white/10 disabled:opacity-50">
          {loading ? "Loading…" : "↻ Refresh"}
        </button>
      </div>
      {error && (
        <div className="mb-3">
          <StatusBanner message={error} onDismiss={() => setError(null)} />
        </div>
      )}
      {cancelled && (
        <p className="text-emerald-300 text-sm mb-3">
          ✅ Cancelled — everything is on its way back to your wallet.{" "}
          <a className="underline" target="_blank" rel="noopener noreferrer"
             href={`https://cexplorer.io/tx/${cancelled}`}>View tx</a>
        </p>
      )}
      {vaults && vaults.length === 0 && (
        <p className="text-white/45 text-sm">No live vaults for this wallet yet — open one below.</p>
      )}
      <div className="space-y-3">
        {vaults?.map((v) => {
          const pinned = markets.find((m) => m.poolIdent === v.decoded.poolIdent)
            ?? MARKETS.find((m) => m.poolIdent === v.decoded.poolIdent);
          const ext = v.decoded.extension;
          return (
            <div key={`${v.txHash}#${v.outputIndex}`} className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full sundae-grad text-white">
                  {ext?.kind === "dca" ? "📆 DCA" : v.decoded.isSelf ? "⚡ Trading vault" : "🎯 One-shot"}
                </span>
                <span className="text-[11px] text-white/40">
                  {pinned
                    ? `${pinned.emoji} ${pinned.name}`
                    : v.decoded.poolIdent
                      ? "📌 pinned pool"
                      : "🌐 any market"}
                </span>
              </div>
              <p className="text-2xl font-extrabold text-white mt-2">{ada(v.lovelace)} ₳</p>
              {v.tokens.map((t) => (
                <p key={t.unit} className="text-sm text-white/70">+ {tokenLabel(t.unit, t.quantity)}</p>
              ))}
              {ext?.kind === "dca" && (
                <p className="text-xs text-white/45 mt-1">
                  {ada(ext.legLovelace ?? 0n)}₳ every {Math.round((ext.cadenceSeconds ?? 0) / 3600)}h
                </p>
              )}
              <div className="flex items-center justify-between mt-3">
                <a className="text-xs text-sky-300 underline" target="_blank" rel="noopener noreferrer"
                   href={`https://cexplorer.io/tx/${v.txHash}`}>
                  {v.txHash.slice(0, 12)}…#{v.outputIndex}
                </a>
                <div className="flex items-center gap-3">
                  <a className="text-xs text-white/55 hover:text-white" target="_blank" rel="noopener noreferrer"
                     href="https://t.me/AdaWatchBot" title="Trade it from the bot">
                    Trade in Telegram →
                  </a>
                  {(() => {
                    const ref = `${v.txHash}#${v.outputIndex}`;
                    const isArmed = armed === ref;
                    const isCancelling = cancelling === ref;
                    return (
                      <button
                        onClick={() => (isArmed ? cancelVault(v) : arm(ref))}
                        disabled={cancelling !== null}
                        className={`text-xs font-bold px-3 py-1.5 rounded-full disabled:opacity-50 ${
                          isArmed
                            ? "text-white bg-rose-500/80 hover:bg-rose-500 animate-pulse"
                            : "text-rose-300 glass hover:bg-rose-500/10"
                        }`}>
                        {isCancelling
                          ? "Cancelling…"
                          : isArmed
                            ? `⚠️ Withdraw ${ada(v.lovelace)} ₳${v.tokens.length ? " + tokens" : ""}? Tap again`
                            : "✕ Cancel & withdraw"}
                      </button>
                    );
                  })()}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
