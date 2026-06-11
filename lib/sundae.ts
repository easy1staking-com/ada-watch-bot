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
