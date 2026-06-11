import SignerCard from "@/components/SignerCard";
import VaultList from "@/components/VaultList";

export const metadata = {
  title: "Strategies — Ada Watch Bot",
  description:
    "Deposit ADA once, buy tokens with one tap from Telegram. Non-custodial SundaeSwap v3 strategy orders.",
};

export default function Strategies() {
  return (
    <main className="max-w-6xl mx-auto px-5 py-16">
      <div className="text-center mb-12">
        <a
          href="https://sundae.fi"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-[12px] font-bold text-white sundae-grad px-4 py-1.5 rounded-full hover:opacity-90"
        >
          🍨 In collaboration with SundaeSwap
        </a>
        <h1 className="mt-5 text-4xl md:text-5xl font-extrabold text-white">
          Deposit once. <span className="sundae-text">Buy with one tap.</span>
        </h1>
        <p className="text-white/50 mt-4 max-w-lg mx-auto">
          A strategy is your own on-chain vault: it keeps staking, only trades within your
          limits, and you can withdraw whenever you like.
        </p>
      </div>

      <div className="max-w-xl mx-auto mb-10">
        <VaultList />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="glass rounded-3xl p-7">
          <span className="w-9 h-9 rounded-full tg-btn grid place-items-center font-bold">1</span>
          <p className="font-bold text-white mt-4">Pair with the bot</p>
          <SignerCard />
        </div>

        <div className="glass rounded-3xl p-7">
          <span className="w-9 h-9 rounded-full tg-btn grid place-items-center font-bold">2</span>
          <p className="font-bold text-white mt-4">Deposit ADA</p>
          <p className="text-sm text-white/45 mt-1 mb-4">
            Connect your wallet, choose an amount, sign. Funds stay yours — on-chain, staking,
            cancelable.
          </p>
          <a
            href="/strategies/deposit"
            className="tg-btn block text-center w-full py-3 rounded-xl font-bold hover:opacity-90"
          >
            Open the deposit wizard →
          </a>
        </div>

        <div className="glass rounded-3xl p-7 sundae-ring">
          <div className="flex justify-between items-start">
            <span className="w-9 h-9 rounded-full sundae-grad grid place-items-center font-bold">3</span>
            <span className="text-[11px] font-bold text-emerald-300 bg-emerald-400/10 px-2.5 py-1 rounded-full">
              ● ARMED
            </span>
          </div>
          <p className="font-bold text-white mt-4">Fire from your phone</p>
          <p className="text-3xl font-extrabold text-white mt-1">
            10 <span className="text-sky-400">₳</span>
          </p>
          <p className="text-[11px] text-white/35 font-mono">example vault · tradeable 6.72 ₳</p>
          <div className="grid grid-cols-3 gap-2 mt-4 text-sm font-bold">
            <span className="glass py-2.5 rounded-xl text-center">🐶</span>
            <span className="glass py-2.5 rounded-xl text-center">🐍</span>
            <span className="glass py-2.5 rounded-xl text-center">💵</span>
          </div>
          <span className="block w-full mt-2 py-2.5 rounded-xl text-sm font-bold text-rose-300 glass text-center">
            Cancel &amp; withdraw
          </span>
        </div>
      </div>

      <div className="glass rounded-3xl p-8 mt-10">
        <h2 className="text-xl font-extrabold text-white mb-4">How is this non-custodial?</h2>
        <div className="grid md:grid-cols-2 gap-x-10 gap-y-3 text-sm text-white/55 leading-relaxed">
          <p>
            Your deposit sits in a <b className="text-white/80">SundaeSwap v3 strategy order</b> —
            a UTxO at the Sundae order contract that names <b className="text-white/80">your</b>{" "}
            key as owner and Ada Watch&apos;s key only as the trade signer.
          </p>
          <p>
            The bot can only do one thing: submit a swap <b className="text-white/80">within the
            order&apos;s bounds</b> (your amount, a capped protocol fee, a time window). It cannot
            move funds anywhere else.
          </p>
          <p>
            Every trade&apos;s result goes where <b className="text-white/80">you</b> chose at
            deposit: straight to your wallet (one-shot) or back into the vault (trading/DCA).
          </p>
          <p>
            You can <b className="text-white/80">cancel at any time</b> with your own wallet
            signature and the full balance returns to you. No permission needed from anyone.
          </p>
        </div>
      </div>

      <p className="text-center text-[12px] text-white/40 mt-3">
        Strategies are powered by{" "}
        <a
          href="https://sundae.fi"
          target="_blank"
          rel="noopener noreferrer"
          className="sundae-text font-bold hover:opacity-80"
        >
          SundaeSwap v3
        </a>{" "}
        — non-custodial, bounded, owner-cancelable orders executed by the Sundae scooper
        network.
      </p>
    </main>
  );
}
