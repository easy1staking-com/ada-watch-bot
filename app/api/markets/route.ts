import { NextRequest, NextResponse } from "next/server";

/**
 * Tradeable ADA/token markets for the deposit wizard, straight from the public
 * SundaeSwap GraphQL API (per the 2026-06-24 session decision: metadata and TVL
 * from Sundae itself — no hand-typed policy ids, no registry drift).
 *
 * Only V3 constant-product ADA-base pools above a TVL floor are returned —
 * exactly the pools strategy orders can execute against, deep enough that
 * scoopers won't skip them. Deduped to the deepest pool per token.
 */

const SUNDAE_GRAPHQL = "https://api.sundae.fi/graphql";

/** ~10k ada TVL floor — thin pools get skipped by scoopers and give awful prices. */
const MIN_TVL_LOVELACE = 10_000_000_000n;

const MAX_MARKETS = 30;

const POOL_FIELDS = `
  id
  version
  assets { policyId assetNameHex ticker decimals }
  current { tvl { quantity } }
`;

interface SundaePool {
  id: string;
  version: string;
  assets: { policyId: string; assetNameHex: string; ticker: string | null; decimals: number | null }[];
  current: { tvl: { quantity: string } } | null;
}

export interface DiscoveredMarket {
  name: string;
  policyId: string;
  assetNameHex: string;
  decimals: number;
  poolIdent: string;
  tvlLovelace: string;
}

function toMarkets(pools: SundaePool[]): DiscoveredMarket[] {
  const deepestByUnit = new Map<string, DiscoveredMarket & { tvl: bigint }>();
  for (const pool of pools) {
    if (pool.version !== "V3" || pool.assets.length !== 2 || !pool.current) continue;
    const [a, b] = pool.assets;
    if (a.policyId !== "ada") continue; // ADA-base pairs only
    if (!b.ticker) continue; // no metadata -> not shown (same scam gate as the bot)
    const tvl = BigInt(pool.current.tvl.quantity);
    if (tvl < MIN_TVL_LOVELACE) continue;
    const unit = b.policyId + b.assetNameHex;
    const existing = deepestByUnit.get(unit);
    if (!existing || tvl > existing.tvl) {
      deepestByUnit.set(unit, {
        name: b.ticker,
        policyId: b.policyId,
        assetNameHex: b.assetNameHex,
        decimals: b.decimals ?? 0,
        poolIdent: pool.id,
        tvlLovelace: tvl.toString(),
        tvl,
      });
    }
  }
  return [...deepestByUnit.values()]
    .sort((x, y) => (y.tvl > x.tvl ? 1 : -1))
    .slice(0, MAX_MARKETS)
    .map(({ tvl: _tvl, ...market }) => market);
}

export async function GET(request: NextRequest) {
  const term = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  const isSearch = term.length > 0;
  const query = isSearch
    ? `query Search($term: String!) { pools { search(term: $term) { ${POOL_FIELDS} } } }`
    : `{ pools { popular { ${POOL_FIELDS} } } }`;

  const res = await fetch(SUNDAE_GRAPHQL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(isSearch ? { query, variables: { term } } : { query }),
    // popular list barely moves — cache hard; searches stay fresh-ish
    next: { revalidate: isSearch ? 60 : 600 },
  });
  if (!res.ok) {
    return NextResponse.json({ error: `sundae api ${res.status}` }, { status: 502 });
  }
  const json = await res.json();
  const pools: SundaePool[] = json.data?.pools?.[isSearch ? "search" : "popular"] ?? [];
  return NextResponse.json(toMarkets(pools));
}
