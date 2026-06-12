import { NextRequest, NextResponse } from "next/server";

/** Server-side Blockfrost proxy: current delegation of a stake account. */
export async function GET(request: NextRequest) {
  const stake = request.nextUrl.searchParams.get("stake") ?? "";
  if (!stake.startsWith("stake1")) {
    return NextResponse.json({ error: "not a stake address" }, { status: 400 });
  }
  const key = process.env.BLOCKFROST_KEY;
  if (!key) {
    return NextResponse.json({ error: "BLOCKFROST_KEY not configured" }, { status: 503 });
  }
  const res = await fetch(`https://cardano-mainnet.blockfrost.io/api/v0/accounts/${stake}`, {
    headers: { project_id: key },
    next: { revalidate: 0 },
  });
  if (res.status === 404) {
    return NextResponse.json({ active: false, pool_id: null });
  }
  if (!res.ok) {
    return NextResponse.json({ error: `blockfrost ${res.status}` }, { status: 502 });
  }
  const account = await res.json();
  return NextResponse.json({ active: account.active, pool_id: account.pool_id ?? null });
}
