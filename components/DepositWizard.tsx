"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useWallet } from "@/components/WalletContext";
import {
  MARKETS,
  Market,
  MAX_PROTOCOL_FEE_LOVELACE,
  ORDER_SCRIPT_HASH,
  buildStrategyOrderDatum,
  encodeExtension,
  estimateDcaCosts,
  randomStrategyId,
  bytesToHex,
} from "@/lib/sundae";

type Flavor = "oneshot" | "trading" | "dca";

const CADENCES = [
  { label: "Every 6 hours", seconds: 6 * 3600 },
  { label: "Every 12 hours", seconds: 12 * 3600 },
  { label: "Daily", seconds: 24 * 3600 },
  { label: "Weekly", seconds: 7 * 24 * 3600 },
];

const ada = (lovelace: bigint) => (Number(lovelace) / 1_000_000).toFixed(2);

function WizardInner() {
  const { wallet } = useWallet();
  const signer = useSearchParams().get("signer")?.toLowerCase() ?? "";
  const signerValid = /^[0-9a-f]{64}$/.test(signer);

  const [step, setStep] = useState(0);
  const [flavor, setFlavor] = useState<Flavor | null>(null);
  const [market, setMarket] = useState<Market | null>(null);
  const [anyMarket, setAnyMarket] = useState(false);
  const [depositAda, setDepositAda] = useState(25);
  const [legAda, setLegAda] = useState(10);
  const [cadence, setCadence] = useState(CADENCES[2].seconds);
  const [busy, setBusy] = useState<string | null>(null);
  const [result, setResult] = useState<{ txHash: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const deposit = BigInt(Math.round(depositAda * 1_000_000));
  const leg = BigInt(Math.round(legAda * 1_000_000));
  const dcaCosts = useMemo(() => estimateDcaCosts(deposit, leg), [deposit, leg]);
  const tradingTrips = Number((deposit - 2_000_000n) / (2n * MAX_PROTOCOL_FEE_LOVELACE));

  async function submit() {
    setError(null);
    setBusy("Connecting wallet…");
    try {
      const { MeshTxBuilder, deserializeAddress, scriptAddress, serializeAddressObj } =
        await import("@meshsdk/core");
      if (!wallet) throw new Error("Connect your wallet first (top-right button).");

      const changeAddress = await wallet.getChangeAddress();
      const { pubKeyHash, stakeCredentialHash } = deserializeAddress(changeAddress);
      if (!stakeCredentialHash) throw new Error("Wallet address has no stake part — use a base address.");

      const isSelf = flavor !== "oneshot";
      const extension = flavor === "dca"
        ? encodeExtension({ kind: "dca", strategyId: randomStrategyId(), dcaUnit: market!.policyId + market!.assetNameHex, cadenceSeconds: cadence, legLovelace: leg, slippageBp: 0 })
        : encodeExtension({ kind: "manual", strategyId: randomStrategyId() });

      const datum = buildStrategyOrderDatum({
        poolIdent: market!.poolIdent,
        ownerKeyHash: stakeCredentialHash,
        maxProtocolFee: MAX_PROTOCOL_FEE_LOVELACE,
        destination: isSelf ? undefined : { paymentKeyHash: pubKeyHash, stakeKeyHash: stakeCredentialHash },
        signerVkey: signer,
        extension,
      });

      const orderAddress = serializeAddressObj(
        scriptAddress(ORDER_SCRIPT_HASH, stakeCredentialHash, false), 1);

      setBusy("Building transaction…");
      const txBuilder = new MeshTxBuilder({ verbose: false });
      const unsigned = await txBuilder
        .txOut(orderAddress, [{ unit: "lovelace", quantity: deposit.toString() }])
        .txOutInlineDatumValue(datum, "CBOR")
        .changeAddress(changeAddress)
        .selectUtxosFrom(await wallet.getUtxos())
        .complete();

      setBusy("Waiting for signature…");
      const signed = await wallet.signTx(unsigned);
      setBusy("Submitting…");
      const txHash = await wallet.submitTx(signed);
      setResult({ txHash });
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(null);
    }
  }

  if (!signerValid) {
    return (
      <div className="glass rounded-3xl p-8 text-center">
        <p className="text-white/70">
          Open this page from the bot: type{" "}
          <span className="text-sky-300 font-mono">/strategies</span> in Telegram and tap your
          personal link — it carries the signer key your vault will be delegated to.
        </p>
      </div>
    );
  }

  if (result) {
    return (
      <div className="glass rounded-3xl p-8 text-center sundae-ring">
        <p className="text-4xl">⚡</p>
        <h2 className="text-2xl font-extrabold text-white mt-3">Vault armed!</h2>
        <p className="text-white/55 mt-3 text-sm">
          Deposit submitted. The bot will message you the moment it confirms on-chain — then
          your buy buttons appear under <span className="font-mono text-sky-300">/strategies</span>.
        </p>
        <a className="text-sky-300 underline text-sm mt-4 inline-block" target="_blank" rel="noopener noreferrer"
           href={`https://cexplorer.io/tx/${result.txHash}`}>View transaction</a>
      </div>
    );
  }

  return (
    <div className="glass rounded-3xl p-8">
      {/* step 1: flavor — destination is decided HERE, with guidance */}
      {step === 0 && (
        <div>
          <h2 className="text-xl font-extrabold text-white mb-1">What kind of strategy?</h2>
          <p className="text-white/45 text-sm mb-6">This decides where each trade&apos;s result goes — it can&apos;t be changed later (but you can always cancel and get everything back).</p>
          <div className="space-y-3">
            <FlavorCard active={flavor === "oneshot"} onClick={() => setFlavor("oneshot")}
              title="🎯 One-shot buy" badge="→ your wallet"
              text="Buy once; tokens and change land straight in your wallet and the vault closes. Simple and done." />
            <FlavorCard active={flavor === "trading"} onClick={() => setFlavor("trading")}
              title="⚡ Trading vault" badge="→ back into the vault"
              text="For trading from Telegram: buy low, sell hours later, rotate tokens — funds stay armed in the vault between trades, no re-deposits. Cancel anytime to sweep everything home." />
            <FlavorCard active={flavor === "dca"} onClick={() => setFlavor("dca")}
              title="📆 DCA" badge="→ back into the vault"
              text="Recurring buys on a schedule. Tokens accumulate in the vault; cancel whenever you like to collect them. Set the budget per buy below — bigger legs mean lower fee overhead." />
          </div>
          <Nav onNext={flavor ? () => setStep(1) : undefined} />
        </div>
      )}

      {/* step 2: market */}
      {step === 1 && (
        <div>
          <h2 className="text-xl font-extrabold text-white mb-1">{flavor === "dca" ? "What are you accumulating?" : "Which market?"}</h2>
          <p className="text-white/45 text-sm mb-6">
            {flavor === "trading"
              ? "Pin the vault to one pool, or leave it open to trade any whitelisted token."
              : "The vault will be pinned to this token's deepest SundaeSwap V3 pool."}
          </p>
          <div className="grid grid-cols-3 gap-3">
            {MARKETS.map((m) => (
              <button key={m.name}
                className={`glass rounded-2xl py-4 font-bold ${market?.name === m.name && !anyMarket ? "sundae-ring" : "hover:bg-white/10"}`}
                onClick={() => { setMarket(m); setAnyMarket(false); }}>
                {m.emoji} {m.name}
              </button>
            ))}
          </div>
          {flavor === "trading" && (
            <p className="w-full mt-3 glass rounded-2xl py-3 px-4 text-xs text-white/35 text-center"
               title="Sundae's scooper backend requires a locked market for now">
              🌐 Any-market vaults are coming once SundaeSwap&apos;s scoopers support open
              markets — for now every vault locks one pool.
            </p>
          )}
          <Nav onBack={() => setStep(0)} onNext={market || anyMarket ? () => setStep(2) : undefined} />
        </div>
      )}

      {/* step 3: amounts + live cost math */}
      {step === 2 && (
        <div>
          <h2 className="text-xl font-extrabold text-white mb-6">Size it</h2>
          <label className="text-sm text-white/55">Deposit (ada)</label>
          <input type="number" min={5} value={depositAda}
            onChange={(e) => setDepositAda(Number(e.target.value))}
            className="w-full glass rounded-xl px-4 py-3 mt-1 mb-4 text-white bg-transparent text-lg font-bold" />
          {flavor === "dca" && (
            <>
              <label className="text-sm text-white/55">Per-buy budget (ada)</label>
              <input type="number" min={1} value={legAda}
                onChange={(e) => setLegAda(Number(e.target.value))}
                className="w-full glass rounded-xl px-4 py-3 mt-1 mb-4 text-white bg-transparent text-lg font-bold" />
              <label className="text-sm text-white/55">Cadence</label>
              <div className="grid grid-cols-2 gap-2 mt-1 mb-4">
                {CADENCES.map((c) => (
                  <button key={c.seconds}
                    className={`glass rounded-xl py-2 text-sm font-bold ${cadence === c.seconds ? "sundae-ring" : "hover:bg-white/10"}`}
                    onClick={() => setCadence(c.seconds)}>{c.label}</button>
                ))}
              </div>
            </>
          )}
          <div className="rounded-2xl bg-white/5 border border-white/10 p-4 text-sm space-y-1">
            {flavor === "dca" ? (
              <>
                <p className="text-white/70">≈ <b className="text-white">{dcaCosts.legs} buys</b> before the vault runs out</p>
                <p className="text-white/70">Batcher fee ≤ 1.28₳/buy = <b className={dcaCosts.feePctPerLeg > 10 ? "text-rose-300" : "text-emerald-300"}>{dcaCosts.feePctPerLeg.toFixed(1)}% overhead</b> per buy</p>
                {dcaCosts.feePctPerLeg > 10 && <p className="text-rose-300">😬 That overhead is steep — consider bigger per-buy budgets.</p>}
                <p className="text-white/40">2₳ stays as the scooper floor; everything returns when you cancel.</p>
              </>
            ) : flavor === "trading" ? (
              <>
                <p className="text-white/70">Tradeable now: <b className="text-white">{ada(deposit - MAX_PROTOCOL_FEE_LOVELACE - 2_000_000n)}₳</b></p>
                <p className="text-white/70">Fee headroom: ≈ <b className="text-white">{tradingTrips}</b> round-trips (≤1.28₳ per trade)</p>
              </>
            ) : (
              <p className="text-white/70">Buys <b className="text-white">{ada(deposit - MAX_PROTOCOL_FEE_LOVELACE - 2_000_000n)}₳</b> of {market?.name}; tokens + change return to your wallet.</p>
            )}
          </div>
          <Nav onBack={() => setStep(1)} onNext={depositAda >= 5 ? () => setStep(3) : undefined} />
        </div>
      )}

      {/* step 4: review + sign */}
      {step === 3 && (
        <div>
          <h2 className="text-xl font-extrabold text-white mb-6">Review</h2>
          <div className="rounded-2xl bg-white/5 border border-white/10 p-4 text-sm space-y-2">
            <Row k="Strategy" v={flavor === "dca" ? `📆 DCA ${market?.name}` : flavor === "trading" ? "⚡ Trading vault" : `🎯 One-shot ${market?.name}`} />
            <Row k="Deposit" v={`${depositAda} ada`} />
            {flavor === "dca" && <Row k="Schedule" v={`${legAda}₳ ${CADENCES.find((c) => c.seconds === cadence)?.label.toLowerCase()}`} />}
            <Row k="Market" v={anyMarket ? "Any (decided at trade time)" : `${market?.emoji} ${market?.name}`} />
            <Row k="Results go" v={flavor === "oneshot" ? "to your wallet" : "back into the vault"} />
            <Row k="Bot signer" v={`${signer.slice(0, 12)}…${signer.slice(-8)}`} />
          </div>
          <p className="text-[12px] text-white/40 mt-3">
            🔒 Non-custodial: only your wallet can cancel; the bot can only trade within these
            bounds, and results only ever flow to your vault or your wallet.
          </p>
          {error && <p className="text-rose-300 text-sm mt-3">{error}</p>}
          <Nav onBack={() => setStep(2)} />
          <button onClick={submit} disabled={!!busy}
            className="tg-btn w-full mt-3 py-3.5 rounded-2xl font-bold disabled:opacity-50">
            {busy ?? (wallet ? "Sign & deposit" : "Connect wallet first (top-right)")}
          </button>
        </div>
      )}
    </div>
  );
}

function FlavorCard({ active, onClick, title, badge, text }: {
  active: boolean; onClick: () => void; title: string; badge: string; text: string;
}) {
  return (
    <button onClick={onClick}
      className={`w-full text-left glass rounded-2xl p-4 ${active ? "sundae-ring" : "hover:bg-white/10"}`}>
      <p className="font-bold text-white">{title}{" "}
        <span className="text-[10px] align-middle sundae-grad text-white px-2 py-0.5 rounded-full">{badge}</span>
      </p>
      <p className="text-sm text-white/50 mt-1">{text}</p>
    </button>
  );
}

function Row({ k, v }: { k: string; v?: string }) {
  return (
    <p className="flex justify-between"><span className="text-white/45">{k}</span><span className="text-white font-bold">{v}</span></p>
  );
}

function Nav({ onBack, onNext }: { onBack?: () => void; onNext?: () => void }) {
  return (
    <div className="flex justify-between mt-6">
      {onBack ? <button className="text-white/50 hover:text-white text-sm" onClick={onBack}>← Back</button> : <span />}
      {onNext && <button className="tg-btn px-6 py-2.5 rounded-full font-bold" onClick={onNext}>Next →</button>}
    </div>
  );
}

export default function DepositWizard() {
  return (
    <Suspense fallback={<div className="glass rounded-3xl p-8 text-center text-white/40">Loading…</div>}>
      <WizardInner />
    </Suspense>
  );
}
