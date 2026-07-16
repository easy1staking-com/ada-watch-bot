import { NextRequest, NextResponse } from "next/server";

/**
 * Server-side Blockfrost proxy for the Evolution SDK's browser provider (the BF
 * key must never reach the browser). The provider is pointed at /api/bf and this
 * route forwards to Blockfrost mainnet, injecting the key.
 *
 * Locked to the exact endpoint families the Evolution Blockfrost provider uses —
 * this is not a general-purpose proxy.
 *
 * Requires BLOCKFROST_KEY in the Vercel project environment.
 */

const BF_BASE = "https://cardano-mainnet.blockfrost.io/api/v0";

// endpoint families used by @evolution-sdk/evolution's BlockfrostEffect
const ALLOWED = [
  /^epochs\/latest\/parameters$/,
  /^addresses\/[a-z0-9_]+\/utxos(\/[a-f0-9]+)?$/,
  /^assets\/[a-f0-9]+\/addresses$/,
  /^accounts\/[a-z0-9_]+$/,
  /^scripts\/[a-f0-9]+(\/cbor)?$/,
  /^scripts\/datum\/[a-f0-9]+\/cbor$/,
  /^txs\/[a-f0-9]+(\/utxos)?$/,
  /^tx\/submit$/,
  /^utils\/txs\/evaluate\/utxos$/,
];

async function forward(request: NextRequest, params: Promise<{ path: string[] }>) {
  const path = (await params).path.join("/");
  if (!ALLOWED.some((re) => re.test(path))) {
    return NextResponse.json({ error: "path not allowed" }, { status: 400 });
  }
  const key = process.env.BLOCKFROST_KEY;
  if (!key) {
    return NextResponse.json({ error: "BLOCKFROST_KEY not configured" }, { status: 503 });
  }

  const url = `${BF_BASE}/${path}${request.nextUrl.search}`;
  const headers: Record<string, string> = { project_id: key };
  const contentType = request.headers.get("content-type");
  if (contentType) headers["Content-Type"] = contentType;

  const res = await fetch(url, {
    method: request.method,
    headers,
    body: request.method === "POST" ? await request.arrayBuffer() : undefined,
    next: { revalidate: 0 },
  });

  const body = await res.arrayBuffer();
  return new NextResponse(body, {
    status: res.status,
    headers: { "Content-Type": res.headers.get("content-type") ?? "application/json" },
  });
}

export async function GET(request: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return forward(request, ctx.params);
}

export async function POST(request: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return forward(request, ctx.params);
}
