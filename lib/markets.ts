"use client";

/**
 * Client side of /api/markets: dynamic tradeable-market list for the deposit
 * wizard and vault display. The curated trio keeps its hand-picked emoji;
 * everything else discovered from Sundae gets the coin.
 */
import { useEffect, useState } from "react";
import { MARKETS, Market } from "@/lib/sundae";

interface ApiMarket {
  name: string;
  policyId: string;
  assetNameHex: string;
  decimals: number;
  poolIdent: string;
  tvlLovelace: string;
}

function toMarket(m: ApiMarket): Market {
  const curated = MARKETS.find((c) => c.policyId === m.policyId && c.assetNameHex === m.assetNameHex);
  return {
    name: m.name,
    emoji: curated?.emoji ?? "🪙",
    policyId: m.policyId,
    assetNameHex: m.assetNameHex,
    decimals: m.decimals,
    poolIdent: m.poolIdent,
  };
}

export async function fetchMarkets(term?: string): Promise<Market[]> {
  const res = await fetch(`/api/markets${term ? `?q=${encodeURIComponent(term)}` : ""}`);
  if (!res.ok) throw new Error(`market list failed (${res.status})`);
  const list: ApiMarket[] = await res.json();
  return list.map(toMarket);
}

/**
 * Top markets by TVL, curated trio as instant fallback while loading (and if
 * the API is down the trio still works — same behaviour as before discovery).
 */
export function useMarkets(): { markets: Market[]; loaded: boolean } {
  const [markets, setMarkets] = useState<Market[]>(MARKETS);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    let cancelled = false;
    fetchMarkets()
      .then((list) => {
        if (!cancelled && list.length > 0) {
          setMarkets(list);
          setLoaded(true);
        }
      })
      .catch(() => {
        /* keep the curated trio */
      });
    return () => {
      cancelled = true;
    };
  }, []);
  return { markets, loaded };
}
