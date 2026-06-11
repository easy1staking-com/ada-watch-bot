/**
 * SundaeSwap V3 strategy-order building: minimal PlutusData CBOR encoder + the
 * OrderDatum/extension builders, byte-compatible with ada-watch's Java builders
 * (golden-tested against the same vectors — see scripts/test-datum.mjs).
 */

// ---------------------------------------------------------------- constants

export const ORDER_SCRIPT_HASH =
  "fa6a58bbe2d0ff05534431c8e2f0ef2cbdc1602a8456e4b13c8f3077";

export const MAX_PROTOCOL_FEE_LOVELACE = 1_280_000n;
export const SCOOPER_MIN_UTXO_LOVELACE = 2_000_000n;

export interface Market {
  name: string;
  emoji: string;
  policyId: string;
  assetNameHex: string;
  decimals: number;
  poolIdent: string;
}

export const MARKETS: Market[] = [
  { name: "HOSKY", emoji: "🐶", policyId: "a0028f350aaabe0545fdcb56b039bfb08e4bb4d8c4d7c3c7d481c235", assetNameHex: "484f534b59", decimals: 0, poolIdent: "455422de9777d248aaaa71da9e17f67ddb6e003aadea1f4f97d24ddd" },
  { name: "SNEK", emoji: "🐍", policyId: "279c909f348e533da5808898f87f9a14bb2c3dfbbacccd631d927a3f", assetNameHex: "534e454b", decimals: 0, poolIdent: "cacb7fd5f5b84bf876d40dc60d4991c72112d78d76132b1fb769e6ad" },
  { name: "USDM", emoji: "💵", policyId: "c48cbb3d5e57ed56e276bc45f99ab39abe94e6cd7ac39fb402da47ad", assetNameHex: "0014df105553444d", decimals: 6, poolIdent: "64f35d26b237ad58e099041bc14c687ea7fdc58969d7d5b66e2540ef" },
];

// ------------------------------------------------- minimal PlutusData CBOR

export type Plutus =
  | { constr: number; fields: Plutus[] }
  | { int: bigint }
  | { bytes: Uint8Array }
  | { list: Plutus[] };

const hexToBytes = (hex: string): Uint8Array =>
  new Uint8Array(hex.match(/.{2}/g)?.map((b) => parseInt(b, 16)) ?? []);

export const bytesToHex = (bytes: Uint8Array): string =>
  Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");

function header(major: number, value: bigint): number[] {
  if (value < 24n) return [Number((BigInt(major) << 5n) | value)];
  if (value < 256n) return [(major << 5) | 24, Number(value)];
  if (value < 65536n) return [(major << 5) | 25, Number(value >> 8n), Number(value & 0xffn)];
  if (value < 4294967296n) {
    const v = Number(value);
    return [(major << 5) | 26, (v >>> 24) & 0xff, (v >>> 16) & 0xff, (v >>> 8) & 0xff, v & 0xff];
  }
  const out = [(major << 5) | 27];
  for (let shift = 56n; shift >= 0n; shift -= 8n) out.push(Number((value >> shift) & 0xffn));
  return out;
}

/** Serializes following aiken/CCL conventions: indefinite arrays when non-empty. */
export function encodePlutus(data: Plutus): number[] {
  if ("int" in data) {
    return data.int >= 0n ? header(0, data.int) : header(1, -1n - data.int);
  }
  if ("bytes" in data) {
    return [...header(2, BigInt(data.bytes.length)), ...Array.from(data.bytes)];
  }
  if ("list" in data) {
    if (data.list.length === 0) return [0x80];
    return [0x9f, ...data.list.flatMap(encodePlutus), 0xff];
  }
  // constr: tag 121+alt for 0..6, 1280+alt-7 for 7..127
  const tag = data.constr < 7 ? 121 + data.constr : 1280 + data.constr - 7;
  const body = data.fields.length === 0
    ? [0x80]
    : [0x9f, ...data.fields.flatMap(encodePlutus), 0xff];
  return [...header(6, BigInt(tag)), ...body];
}

export const plutusHex = (data: Plutus): string =>
  bytesToHex(new Uint8Array(encodePlutus(data)));

const constr = (n: number, ...fields: Plutus[]): Plutus => ({ constr: n, fields });
const bytes = (hex: string): Plutus => ({ bytes: hexToBytes(hex) });
const int = (value: bigint): Plutus => ({ int: value });

// --------------------------------------------------------- strategy extension

export type StrategyKind = "manual" | "dca";

export interface ExtensionParams {
  kind: StrategyKind;
  strategyId: Uint8Array; // 8 bytes
  dcaUnit?: string;       // policy+name hex
  cadenceSeconds?: number;
  legLovelace?: bigint;
  slippageBp?: number;
}

/** Wire-compatible with ada-watch's StrategyExtension (AW v1). */
export function encodeExtension(p: ExtensionParams): Uint8Array {
  const head = [0x41, 0x57, 1, p.kind === "dca" ? 1 : 0, ...Array.from(p.strategyId)];
  if (p.kind === "manual") return new Uint8Array(head);
  const unit = hexToBytes(p.dcaUnit!);
  const buffer = [...head, unit.length, ...Array.from(unit)];
  const cadence = p.cadenceSeconds ?? 0;
  buffer.push((cadence >>> 24) & 0xff, (cadence >>> 16) & 0xff, (cadence >>> 8) & 0xff, cadence & 0xff);
  let leg = p.legLovelace ?? 0n;
  const legBytes: number[] = [];
  for (let i = 0; i < 8; i++) { legBytes.unshift(Number(leg & 0xffn)); leg >>= 8n; }
  buffer.push(...legBytes);
  const slippage = p.slippageBp ?? 0;
  buffer.push((slippage >>> 8) & 0xff, slippage & 0xff);
  return new Uint8Array(buffer);
}

export const randomStrategyId = (): Uint8Array => {
  const id = new Uint8Array(8);
  crypto.getRandomValues(id);
  return id;
};

// --------------------------------------------------------------- order datum

export interface OrderDatumParams {
  poolIdent?: string;          // undefined = any market (pool_ident None)
  ownerKeyHash: string;        // stake key hash (28 bytes hex) — may cancel
  maxProtocolFee: bigint;
  destination?: {              // undefined = Destination::Self (vault re-arms)
    paymentKeyHash: string;
    stakeKeyHash?: string;
  };
  signerVkey: string;          // FULL 32-byte hex — the bot's per-user key
  extension: Uint8Array;
}

export function buildStrategyOrderDatum(p: OrderDatumParams): string {
  if (p.signerVkey.length !== 64) throw new Error("signer vkey must be 32 bytes (64 hex chars)");
  const poolIdent = p.poolIdent ? constr(0, bytes(p.poolIdent)) : constr(1);
  const destination = p.destination
    ? constr(0,
        constr(0,
          constr(0, bytes(p.destination.paymentKeyHash)),
          p.destination.stakeKeyHash
            ? constr(0, constr(0, constr(0, bytes(p.destination.stakeKeyHash))))
            : constr(1)),
        constr(0))
    : constr(1); // Self
  const datum = constr(0,
    poolIdent,
    constr(0, bytes(p.ownerKeyHash)),
    int(p.maxProtocolFee),
    destination,
    constr(0, constr(0, bytes(p.signerVkey))),
    { bytes: p.extension });
  return plutusHex(datum);
}

// ----------------------------------------------------------------- cost math

export interface CostEstimate {
  legs: number;
  feePctPerLeg: number;
  totalFeesLovelace: bigint;
}

/** legs = (deposit − 2₳ floor) / (legSize + 1.28₳ fee); fee overhead per leg = 1.28/(leg+1.28) */
export function estimateDcaCosts(depositLovelace: bigint, legLovelace: bigint): CostEstimate {
  const perLeg = legLovelace + MAX_PROTOCOL_FEE_LOVELACE;
  const available = depositLovelace - SCOOPER_MIN_UTXO_LOVELACE;
  const legs = available > 0n && perLeg > 0n ? Number(available / perLeg) : 0;
  return {
    legs,
    feePctPerLeg: Number(MAX_PROTOCOL_FEE_LOVELACE) / Number(perLeg) * 100,
    totalFeesLovelace: BigInt(legs) * MAX_PROTOCOL_FEE_LOVELACE,
  };
}


// ------------------------------------------------- minimal PlutusData decoder

function readHeader(buf: Uint8Array, pos: number): { major: number; value: bigint; next: number } {
  const initial = buf[pos];
  const major = initial >> 5;
  const info = initial & 0x1f;
  if (info < 24) return { major, value: BigInt(info), next: pos + 1 };
  if (info === 24) return { major, value: BigInt(buf[pos + 1]), next: pos + 2 };
  if (info === 25) return { major, value: BigInt((buf[pos + 1] << 8) | buf[pos + 2]), next: pos + 3 };
  if (info === 26) {
    let v = 0n;
    for (let i = 1; i <= 4; i++) v = (v << 8n) | BigInt(buf[pos + i]);
    return { major, value: v, next: pos + 5 };
  }
  if (info === 27) {
    let v = 0n;
    for (let i = 1; i <= 8; i++) v = (v << 8n) | BigInt(buf[pos + i]);
    return { major, value: v, next: pos + 9 };
  }
  if (info === 31) return { major, value: -1n, next: pos + 1 }; // indefinite
  throw new Error("unsupported CBOR header");
}

function decodeAt(buf: Uint8Array, pos: number): { data: Plutus; next: number } {
  const h = readHeader(buf, pos);
  if (h.major === 0) return { data: { int: h.value }, next: h.next };
  if (h.major === 1) return { data: { int: -1n - h.value }, next: h.next };
  if (h.major === 2) {
    const end = h.next + Number(h.value);
    return { data: { bytes: buf.slice(h.next, end) }, next: end };
  }
  if (h.major === 4) {
    const items: Plutus[] = [];
    let p = h.next;
    if (h.value === -1n) {
      while (buf[p] !== 0xff) { const r = decodeAt(buf, p); items.push(r.data); p = r.next; }
      return { data: { list: items }, next: p + 1 };
    }
    for (let i = 0n; i < h.value; i++) { const r = decodeAt(buf, p); items.push(r.data); p = r.next; }
    return { data: { list: items }, next: p };
  }
  if (h.major === 6) {
    const tag = Number(h.value);
    const inner = decodeAt(buf, h.next);
    const fields = "list" in inner.data ? inner.data.list : [];
    const alt = tag >= 1280 ? tag - 1280 + 7 : tag - 121;
    return { data: { constr: alt, fields }, next: inner.next };
  }
  throw new Error("unsupported CBOR major " + h.major);
}

export const decodePlutus = (hex: string): Plutus =>
  decodeAt(new Uint8Array(hex.match(/.{2}/g)!.map((b) => parseInt(b, 16))), 0).data;

export interface DecodedVault {
  poolIdent?: string;
  ownerKeyHash: string;
  maxProtocolFee: bigint;
  isSelf: boolean;
  signerVkey?: string;
  extension?: DecodedExtension;
}

export interface DecodedExtension {
  kind: StrategyKind;
  strategyIdHex: string;
  dcaUnit?: string;
  cadenceSeconds?: number;
  legLovelace?: bigint;
  slippageBp?: number;
}

export function decodeExtension(bytes: Uint8Array): DecodedExtension | undefined {
  if (bytes.length < 12 || bytes[0] !== 0x41 || bytes[1] !== 0x57 || bytes[2] !== 1) return undefined;
  const kind: StrategyKind = bytes[3] === 1 ? "dca" : "manual";
  const strategyIdHex = bytesToHex(bytes.slice(4, 12));
  if (kind === "manual") return { kind, strategyIdHex };
  const unitLen = bytes[12];
  const dcaUnit = bytesToHex(bytes.slice(13, 13 + unitLen));
  let p = 13 + unitLen;
  const cadenceSeconds = (bytes[p] << 24 | bytes[p + 1] << 16 | bytes[p + 2] << 8 | bytes[p + 3]) >>> 0;
  p += 4;
  let legLovelace = 0n;
  for (let i = 0; i < 8; i++) legLovelace = (legLovelace << 8n) | BigInt(bytes[p + i]);
  p += 8;
  const slippageBp = (bytes[p] << 8) | bytes[p + 1];
  return { kind, strategyIdHex, dcaUnit, cadenceSeconds, legLovelace, slippageBp };
}

/** Decode an OrderDatum; undefined when it isn't a Strategy order. */
export function decodeStrategyOrderDatum(hex: string): DecodedVault | undefined {
  try {
    const root = decodePlutus(hex);
    if (!("constr" in root) || root.constr !== 0 || root.fields.length !== 6) return undefined;
    const [pool, owner, fee, destination, details, extension] = root.fields;
    if (!("constr" in details) || details.constr !== 0) return undefined; // not Strategy
    const auth = details.fields[0];
    const signerVkey = "constr" in auth && auth.constr === 0 && "bytes" in auth.fields[0]
      ? bytesToHex((auth.fields[0] as { bytes: Uint8Array }).bytes)
      : undefined;
    return {
      poolIdent: "constr" in pool && pool.constr === 0 && "bytes" in pool.fields[0]
        ? bytesToHex((pool.fields[0] as { bytes: Uint8Array }).bytes)
        : undefined,
      ownerKeyHash: "constr" in owner && "bytes" in owner.fields[0]
        ? bytesToHex((owner.fields[0] as { bytes: Uint8Array }).bytes)
        : "",
      maxProtocolFee: "int" in fee ? fee.int : 0n,
      isSelf: "constr" in destination && destination.constr === 1,
      signerVkey,
      extension: "bytes" in extension ? decodeExtension(extension.bytes) : undefined,
    };
  } catch {
    return undefined;
  }
}
