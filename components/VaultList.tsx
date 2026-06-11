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

export default function VaultList() {
  const { wallet, address } = useWallet();
  const [vaults, setVaults] = useState<LiveVault[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!wallet || !address) return;
    setLoading(true);
    setError(null);
    try {
      const { deserializeAddress, scriptAddress, serializeAddressObj } = await import("@meshsdk/core");
      const { stakeCredentialHash } = deserializeAddress(address);
      if (!stakeCredentialHash) throw new Error("connected address has no stake part");
      const orderAddress = serializeAddressObj(scriptAddress(ORDER_SCRIPT_HASH, stakeCredentialHash, false), 1);

      const res = await fetch("https://api.koios.rest/api/v1/address_utxos?_extended=true", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _addresses: [orderAddress] }),
      });
      if (!res.ok) throw new Error(`Koios ${res.status}`);
      const utxos: {
        tx_hash: string;
        tx_index: number;
        value: string;
        asset_list: { policy_id: string; asset_name: string; quantity: string }[] | null;
        inline_datum: { bytes: string } | null;
      }[] = await res.json();

      const found: LiveVault[] = [];
      for (const u of utxos) {
        const datum = u.inline_datum?.bytes;
        if (!datum) continue;
        const decoded = decodeStrategyOrderDatum(datum);
        if (!decoded) continue;
        found.push({
          txHash: u.tx_hash,
          outputIndex: u.tx_index,
          lovelace: BigInt(u.value),
          tokens: (u.asset_list ?? []).map((a) => ({
            unit: a.policy_id + a.asset_name,
            quantity: BigInt(a.quantity),
          })),
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
      {error && <p className="text-rose-300 text-sm">{error}</p>}
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
                <a className="text-xs text-white/55 hover:text-white" target="_blank" rel="noopener noreferrer"
                   href="https://t.me/AdaWatchBot" title="Trade it from the bot">
                  Trade in Telegram →
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
