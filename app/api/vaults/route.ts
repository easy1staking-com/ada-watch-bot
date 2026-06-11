import { NextRequest, NextResponse } from "next/server";

/**
 * Server-side Blockfrost proxy for the vault list (the BF key must never reach the
 * browser). Locked to SundaeSwap order-script addresses: every order address shares
 * the same payment-credential prefix, so anything else is rejected — this is not a
 * general-purpose proxy.
 *
 * Requires BLOCKFROST_KEY in the Vercel project environment.
 */

// bech32 prefix shared by all mainnet order addresses (header 0x31 + order script hash)
const ORDER_ADDRESS_PREFIX = "addr1z8ax5k9mutg07p2ngscu3chsauktmstq92z9de938j8nqa";

export async function GET(request: NextRequest) {
  const address = request.nextUrl.searchParams.get("address") ?? "";
  if (!address.startsWith(ORDER_ADDRESS_PREFIX)) {
    return NextResponse.json({ error: "not an order address" }, { status: 400 });
  }
  const key = process.env.BLOCKFROST_KEY;
  if (!key) {
    return NextResponse.json({ error: "BLOCKFROST_KEY not configured" }, { status: 503 });
  }

  const utxos: unknown[] = [];
  for (let page = 1; page <= 5; page++) {
    const res = await fetch(
      `https://cardano-mainnet.blockfrost.io/api/v0/addresses/${address}/utxos?count=100&page=${page}`,
      { headers: { project_id: key }, next: { revalidate: 0 } },
    );
    if (res.status === 404) break; // address never used
    if (!res.ok) {
      return NextResponse.json({ error: `blockfrost ${res.status}` }, { status: 502 });
    }
    const batch: unknown[] = await res.json();
    utxos.push(...batch);
    if (batch.length < 100) break;
  }
  return NextResponse.json(utxos);
}
