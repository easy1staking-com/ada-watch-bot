/**
 * Evolution SDK glue for the strategies dApp. Pure TypeScript — no CML, no WASM.
 *
 * Architecture: the browser provider is Blockfrost via the same-origin /api/bf
 * proxy (protocol params, UTxO-by-outref resolution, submission) + the user's
 * CIP-30 wallet for signing. The Blockfrost key never reaches the browser — the
 * proxy injects it server-side, exactly like the other /api routes.
 */
import {
  Address,
  Client,
  Data,
  InlineDatum,
  KeyHash,
  RewardAccount,
  ScriptHash,
  TransactionHash,
  TransactionInput,
  mainnet,
} from "@evolution-sdk/evolution";
import { ORDER_SCRIPT_HASH } from "@/lib/sundae";

/** The raw CIP-30 API object handed out by window.cardano.<wallet>.enable(). */
export type WalletApi = Parameters<ReturnType<typeof Client.make>["withCip30"]>[0] & {
  getChangeAddress(): Promise<string>;
};

export type SigningClient = ReturnType<
  ReturnType<ReturnType<typeof Client.make>["withBlockfrost"]>["withCip30"]
>;

/** Blockfrost through the same-origin proxy (key stays server-side); wallet signs. */
export function makeSigningClient(api: WalletApi): SigningClient {
  const baseUrl = `${window.location.origin}/api/bf`;
  return Client.make(mainnet).withBlockfrost({ baseUrl }).withCip30(api);
}

/** Stake-key credential of a bech32 base address (throws on enterprise addresses). */
export function stakeKeyOf(userAddress: string): KeyHash.KeyHash {
  const staking = Address.fromBech32(userAddress).stakingCredential;
  if (!staking || staking._tag !== "KeyHash") {
    throw new Error("Wallet address has no stake part — use a base address.");
  }
  return staking;
}

/**
 * The user's Sundae order address: payment = order script, staking = the user's
 * own stake key (a standard base address with independent credentials).
 */
export function orderAddressFor(userAddress: string): { orderAddress: string; stakeKeyHashHex: string } {
  const stake = stakeKeyOf(userAddress);
  const order = new Address.Address({
    networkId: 1,
    paymentCredential: ScriptHash.fromHex(ORDER_SCRIPT_HASH),
    stakingCredential: stake,
  });
  return { orderAddress: Address.toBech32(order), stakeKeyHashHex: KeyHash.toHex(stake) };
}

/** Payment-key hash (hex) of a bech32 wallet address. */
export function paymentKeyHashHexOf(userAddress: string): string {
  const payment = Address.fromBech32(userAddress).paymentCredential;
  if (payment._tag !== "KeyHash") {
    throw new Error("connected address is script-controlled — expected a key address");
  }
  return KeyHash.toHex(payment);
}

/** Hex change address from CIP-30 -> bech32. */
export const bech32FromHexAddress = (hex: string): string => Address.toBech32(Address.fromHex(hex));

/** Hex reward address from CIP-30 getRewardAddresses() -> stake1... bech32. */
export const stakeBech32FromHex = (hex: string): string => RewardAccount.toBech32(RewardAccount.fromHex(hex));

/** Out-ref for provider getUtxosByOutRef lookups. */
export function outRef(txHash: string, index: number): TransactionInput.TransactionInput {
  return new TransactionInput.TransactionInput({
    transactionId: TransactionHash.fromHex(txHash),
    index: BigInt(index),
  });
}

/** Inline datum from the CBOR hex our own encoders in lib/sundae.ts produce. */
export const inlineDatumFromCbor = (cborHex: string): InlineDatum.InlineDatum =>
  new InlineDatum.InlineDatum({ data: Data.fromCBORHex(cborHex) });

/** Redeemer from raw CBOR hex (e.g. the Sundae Cancel redeemer d87a80). */
export const redeemerFromCbor = (cborHex: string): Data.Data => Data.fromCBORHex(cborHex);

export const txHashHex = (hash: TransactionHash.TransactionHash): string => TransactionHash.toHex(hash);
