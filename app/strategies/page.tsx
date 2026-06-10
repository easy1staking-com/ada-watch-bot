export const metadata = {
  title: "Strategies — Ada Watch Bot",
  description:
    "Deposit ADA once, buy tokens with one tap from Telegram. Non-custodial SundaeSwap v3 strategy orders.",
};

export default function Strategies() {
  return (
    <main className="max-w-6xl mx-auto px-5 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white">
          Deposit once. <span className="text-sky-400">Buy with one tap.</span>
        </h1>
        <p className="text-white/50 mt-4 max-w-lg mx-auto">
          A strategy is your own on-chain vault: it keeps staking, only trades within your
          limits, and you can withdraw whenever you like. Powered by SundaeSwap v3 strategy
          orders.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="glass rounded-3xl p-7">
          <span className="w-9 h-9 rounded-full tg-btn grid place-items-center font-bold">1</span>
          <p className="font-bold text-white mt-4">Pair with the bot</p>
          <p className="text-sm text-white/45 mt-1 mb-4">
            Type <span className="text-sky-300 font-mono">/strategies</span> in Telegram and tap
            the link — or scan the code from desktop.
          </p>
          <div className="font-mono text-center text-2xl tracking-[.4em] glass rounded-xl py-3 text-sky-300">
            •••••
          </div>
        </div>

        <div className="glass rounded-3xl p-7">
          <span className="w-9 h-9 rounded-full tg-btn grid place-items-center font-bold">2</span>
          <p className="font-bold text-white mt-4">Deposit ADA</p>
          <p className="text-sm text-white/45 mt-1 mb-4">
            Connect your wallet, choose an amount, sign. Funds stay yours — on-chain, staking,
            cancelable.
          </p>
          <button
            className="tg-btn w-full py-3 rounded-xl font-bold opacity-50 cursor-not-allowed"
            disabled
            title="Coming soon"
          >
            Connect wallet — coming soon
          </button>
        </div>

        <div className="glass rounded-3xl p-7 ring-2 ring-sky-400/30">
          <div className="flex justify-between items-start">
            <span className="w-9 h-9 rounded-full tg-btn grid place-items-center font-bold">3</span>
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
            The result of every trade is paid <b className="text-white/80">directly to your
            wallet</b> — the destination is fixed in the order when you create it.
          </p>
          <p>
            You can <b className="text-white/80">cancel at any time</b> with your own wallet
            signature and the full balance returns to you. No permission needed from anyone.
          </p>
        </div>
      </div>

      <p className="text-center text-[12px] text-white/35 mt-8">
        Wallet connect, live vault list and cancellation are landing here soon — pair with the
        bot on Telegram to be first in line.
      </p>
    </main>
  );
}
