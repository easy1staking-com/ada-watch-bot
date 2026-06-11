"use client";

import { useCallback, useEffect, useState } from "react";
import { useWallet } from "@/components/WalletContext";
import {
  MARKETS,
  ORDER_SCRIPT_HASH,
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
const ORDER_SCRIPT_SIZE = 2469;
const CANCEL_REDEEMER_CBOR = "d87a80";

export default function VaultList() {
  const { wallet, address } = useWallet();
  const [vaults, setVaults] = useState<LiveVault[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState<string | null>(null);
  const [cancelled, setCancelled] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!wallet || !address) return;
    setLoading(true);
    setError(null);
    try {
      const { deserializeAddress, scriptAddress, serializeAddressObj } = await import("@meshsdk/core");
      const { stakeCredentialHash } = deserializeAddress(address);
      if (!stakeCredentialHash) throw new Error("connected address has no stake part");
      const orderAddress = serializeAddressObj(scriptAddress(ORDER_SCRIPT_HASH, stakeCredentialHash, false), 1);

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
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [wallet, address]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const cancelVault = useCallback(async (v: LiveVault) => {
    if (!wallet || !address) return;
    if (!confirm(`Cancel this vault and withdraw everything (${ada(v.lovelace)} ₳ + tokens) to your wallet?`)) return;
    const ref = `${v.txHash}#${v.outputIndex}`;
    setCancelling(ref);
    setError(null);
    try {
      const { MeshTxBuilder, deserializeAddress, scriptAddress, serializeAddressObj } =
        await import("@meshsdk/core");
      const { stakeCredentialHash } = deserializeAddress(address);
      const orderAddress = serializeAddressObj(scriptAddress(ORDER_SCRIPT_HASH, stakeCredentialHash, false), 1);

      const collateral = await wallet.getCollateral();
      if (!collateral || collateral.length === 0) {
        throw new Error("No collateral set — enable collateral in your wallet settings (Eternl: Collateral tab), then retry.");
      }
      const col = collateral[0];

      const vaultAssets = [
        { unit: "lovelace", quantity: v.lovelace.toString() },
        ...v.tokens.map((t) => ({ unit: t.unit, quantity: t.quantity.toString() })),
      ];

      const txBuilder = new MeshTxBuilder({ verbose: false });
      const unsigned = await txBuilder
        .spendingPlutusScriptV2()
        .txIn(v.txHash, v.outputIndex, vaultAssets, orderAddress, ORDER_SCRIPT_SIZE)
        .spendingTxInReference(ORDER_REF_SCRIPT_TX_HASH, 0, ORDER_SCRIPT_SIZE.toString(), ORDER_SCRIPT_HASH)
        .txInInlineDatumPresent()
        .txInRedeemerValue(CANCEL_REDEEMER_CBOR, "CBOR", { mem: 300_000, steps: 100_000_000 })
        .requiredSignerHash(stakeCredentialHash)
        .txInCollateral(col.input.txHash, col.input.outputIndex, col.output.amount, col.output.address)
        .changeAddress(address)
        .selectUtxosFrom(await wallet.getUtxos())
        .complete();

      const signed = await wallet.signTx(unsigned, true);
      const txHash = await wallet.submitTx(signed);
      setCancelled(txHash);
      setVaults((prev) => prev?.filter((x) => `${x.txHash}#${x.outputIndex}` !== ref) ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setCancelling(null);
    }
  }, [wallet, address]);

  if (!wallet) {
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
      {error && <p className="text-rose-300 text-sm break-all">{error}</p>}
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
          const pinned = MARKETS.find((m) => m.poolIdent === v.decoded.poolIdent);
          const ext = v.decoded.extension;
          return (
            <div key={`${v.txHash}#${v.outputIndex}`} className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full sundae-grad text-white">
                  {ext?.kind === "dca" ? "📆 DCA" : v.decoded.isSelf ? "⚡ Trading vault" : "🎯 One-shot"}
                </span>
                <span className="text-[11px] text-white/40">
                  {pinned ? `${pinned.emoji} ${pinned.name}` : "🌐 any market"}
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
                  <button
                    onClick={() => cancelVault(v)}
                    disabled={cancelling !== null}
                    className="text-xs font-bold text-rose-300 glass px-3 py-1.5 rounded-full hover:bg-rose-500/10 disabled:opacity-50">
                    {cancelling === `${v.txHash}#${v.outputIndex}` ? "Cancelling…" : "✕ Cancel & withdraw"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
