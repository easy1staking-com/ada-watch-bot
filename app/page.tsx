import Link from "next/link";
import PhoneMock from "@/components/PhoneMock";

export default function Home() {
  return (
    <main>
      {/* HERO */}
      <header className="hero-grad">
        <div className="max-w-6xl mx-auto px-5 pt-20 pb-10 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.05]">
            <span className="text-white">Your wallet,</span>
            <br />
            <span className="fade-text">in your pocket.</span>
          </h1>
          <p className="mt-6 text-lg text-white/55 max-w-xl mx-auto">
            Real-time Cardano notifications on Telegram &amp; Discord — wallets, loans, NFTs.
            And now: deposit ADA once, buy tokens with one tap. Keys never leave your wallet.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <a
              className="tg-btn px-7 py-3.5 rounded-full font-bold hover:opacity-90"
              href="https://t.me/AdaWatchBot"
              target="_blank"
              rel="noopener noreferrer"
            >
              ✈️ Start on Telegram
            </a>
            <Link className="glass px-7 py-3.5 rounded-full font-bold hover:bg-white/10" href="/strategies">
              ⚡ Strategies
            </Link>
          </div>

          {/* PHONE + side notes */}
          <div className="mt-14 grid md:grid-cols-[1fr_auto_1fr] gap-10 items-center text-left">
            <div className="hidden md:block justify-self-end max-w-[220px]">
              <div className="flex -space-x-2 mb-3">
                <span className="w-9 h-9 rounded-full bg-sky-500 grid place-items-center border-2 border-[#0b1320]">🐶</span>
                <span className="w-9 h-9 rounded-full bg-indigo-500 grid place-items-center border-2 border-[#0b1320]">🐍</span>
                <span className="w-9 h-9 rounded-full bg-emerald-500 grid place-items-center border-2 border-[#0b1320]">💵</span>
                <span className="w-9 h-9 rounded-full tg-btn grid place-items-center border-2 border-[#0b1320] text-xs font-bold">+</span>
              </div>
              <p className="text-white/60 text-sm">
                Buy HOSKY, SNEK or USDM straight from the chat — more tokens coming.
              </p>
            </div>

            <PhoneMock />

            <div className="hidden md:block max-w-[220px]">
              <div className="flex gap-2 mb-3 text-lg">
                <span className="w-9 h-9 glass rounded-full grid place-items-center">🔔</span>
                <span className="w-9 h-9 glass rounded-full grid place-items-center">🏦</span>
                <span className="w-9 h-9 glass rounded-full grid place-items-center">🖼</span>
              </div>
              <p className="text-white/60 text-sm">
                Transactions, loan health and NFT sales — pinged the moment they hit the chain.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* FEATURES */}
      <section id="features" className="max-w-6xl mx-auto px-5 py-16">
        <div className="grid md:grid-cols-4 gap-5">
          <div className="glass rounded-3xl p-6">
            <p className="text-3xl">🔔</p>
            <p className="font-bold mt-3 text-white">Transactions</p>
            <p className="text-sm text-white/45 mt-1">
              Up to 20 wallets, every movement, protocol-labelled: AdaMatic, FluidTokens Aquarium,
              SHEN rewards. AdaHandle native — use <code className="text-sky-300">$yourhandle</code> anywhere.
            </p>
          </div>
          <div className="glass rounded-3xl p-6">
            <p className="font-bold mt-3 text-white"><span className="text-3xl block mb-3">🏦</span>Loan health</p>
            <p className="text-sm text-white/45 mt-1">
              Liqwid Health Factor, Indigo CDP collateral ratios, FluidTokens lender &amp; borrower
              positions — alerts when a threshold is crossed, before liquidation hurts.
            </p>
          </div>
          <div className="glass rounded-3xl p-6">
            <p className="text-3xl">🖼</p>
            <p className="font-bold mt-3 text-white">NFT activity</p>
            <p className="text-sm text-white/45 mt-1">
              JPG Store listings, sales, offers and withdrawals on anything your wallets own.
            </p>
          </div>
          <div className="glass rounded-3xl p-6 ring-2 ring-sky-400/40">
            <p className="text-3xl">⚡</p>
            <p className="font-bold mt-3 text-sky-300">Chat purchases</p>
            <p className="text-sm text-white/45 mt-1">
              Non-custodial token buys via SundaeSwap v3 strategies. Bounded, cancelable, yours.
            </p>
          </div>
        </div>
      </section>

      {/* COMMANDS */}
      <section className="max-w-6xl mx-auto px-5 py-10">
        <div className="glass rounded-3xl p-8">
          <h2 className="text-2xl font-extrabold text-white">One command away</h2>
          <p className="text-white/45 text-sm mt-1 mb-6">Identical on Telegram and Discord.</p>
          <div className="grid md:grid-cols-3 gap-x-8 gap-y-3 text-sm">
            <p><code className="text-sky-300">/add address</code> <span className="text-white/45">— watch an address or $adahandle</span></p>
            <p><code className="text-sky-300">/check</code> <span className="text-white/45">— DeFi status across all wallets</span></p>
            <p><code className="text-sky-300">/list</code> <span className="text-white/45">— show your watchlist</span></p>
            <p><code className="text-sky-300">/remove address</code> <span className="text-white/45">— stop watching</span></p>
            <p><code className="text-sky-300">/check set 09:00</code> <span className="text-white/45">— scheduled daily checks (TG)</span></p>
            <p><code className="text-sky-300">/help</code> <span className="text-white/45">— all commands</span></p>
          </div>
        </div>
      </section>

      {/* STRATEGIES TEASER */}
      <section className="max-w-6xl mx-auto px-5 py-14 text-center">
        <h2 className="text-4xl font-extrabold text-white">
          Deposit once. <span className="text-sky-400">Buy with one tap.</span>
        </h2>
        <p className="text-white/50 mt-3 max-w-lg mx-auto">
          A strategy is your own on-chain vault: it keeps staking, only trades within your
          limits, and you can withdraw whenever you like.
        </p>
        <Link
          className="inline-block mt-7 tg-btn px-8 py-3.5 rounded-full font-bold hover:opacity-90"
          href="/strategies"
        >
          Open a strategy →
        </Link>
        <p className="text-[12px] text-white/35 mt-6">
          🔒 Non-custodial · orders bounded by amount, fee and time · powered by SundaeSwap v3
        </p>
      </section>
    </main>
  );
}
