import Link from "next/link";
import PhoneMock from "@/components/PhoneMock";
import TelegramIcon from "@/components/TelegramIcon";
import DiscordIcon from "@/components/DiscordIcon";

const BADGE_STYLES: Record<string, string> = {
  DeFi: "bg-sky-400/15 text-sky-300",
  NFT: "bg-violet-400/15 text-violet-300",
  Trading: "sundae-grad text-white",
  Payments: "bg-emerald-400/15 text-emerald-300",
  Rewards: "bg-amber-400/15 text-amber-300",
};

function Badge({ label }: { label?: string }) {
  if (!label) return null;
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${BADGE_STYLES[label] ?? "bg-white/10 text-white/60"}`}>
      {label}
    </span>
  );
}

const DAPPS: { name: string; badge?: string; extra?: string; text: string; href?: string }[] = [
  {
    name: "Liqwid Finance",
    badge: "DeFi",
    text: "Outstanding loans with the Health Factor tracked over time — alerts when HF crosses a threshold in either direction, before liquidation hurts.",
    href: "https://liqwid.finance",
  },
  {
    name: "Indigo Protocol",
    badge: "DeFi",
    text: "Collateralized Debt Positions with the Collateral Ratio tracked against each asset's Liquidation Ratio and Redemption Margin Ratio.",
    href: "https://indigoprotocol.io",
  },
  {
    name: "FluidTokens Lending",
    badge: "DeFi",
    text: "Lender and borrower positions, framed differently for each side: counterparty risk for lenders, liquidation risk for borrowers. CR tracked against 125% / 135% / 150% thresholds.",
    href: "https://app.fluidtokens.com",
  },
  {
    name: "JPG Store",
    badge: "NFT",
    text: "New listings, listing updates, sales, withdrawals and offers on anything your watched wallets own.",
    href: "https://www.jpg.store",
  },
  {
    name: "SundaeSwap Strategies",
    badge: "Trading",
    extra: "🍨 NEW",
    text: "Deposit once, buy or sell tokens with one tap from chat — non-custodial vaults that only trade within your limits.",
    href: "/strategies",
  },
  {
    name: "AdaMatic",
    badge: "Payments",
    text: "Automated and recurring payment transactions recognised and labelled on your watchlist.",
    href: "https://adamatic.xyz",
  },
  {
    name: "FluidTokens Aquarium",
    badge: "Payments",
    text: "Aquarium transactions detected and labelled the moment they touch a watched wallet.",
    href: "https://aquarium.fluidtokens.com",
  },
  {
    name: "SHEN rewards",
    badge: "Rewards",
    text: "Rewards distributions from the SHEN (DJED) distribution address, called out by name.",
  },
  {
    name: "Wallet transfers",
    text: "Every inbound and outbound transaction on up to 20 watched wallets — ADA, tokens, with counterparty shown.",
  },
  {
    name: "Ada Handle",
    text: "Anywhere an address is accepted, use $yourhandle instead — resolution is built in.",
    href: "https://handle.me",
  },
];

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
          <div className="mt-8 flex justify-center gap-3 flex-wrap">
            <a
              className="tg-btn pl-4 pr-7 py-2.5 rounded-full font-bold hover:opacity-90 inline-flex items-center gap-2"
              href="https://t.me/AdaWatchBot"
              target="_blank"
              rel="noopener noreferrer"
            >
              <TelegramIcon size={28} /> Telegram
            </a>
            <a
              className="pl-4 pr-7 py-2.5 rounded-full font-bold hover:opacity-90 inline-flex items-center gap-2 text-white"
              style={{ background: "#5865F2" }}
              href="/get-started#discord"
            >
              <DiscordIcon size={28} /> Discord
            </a>
            <Link className="glass px-7 py-2.5 rounded-full font-bold hover:bg-white/10 inline-flex items-center gap-2" href="/strategies">
              🍨 Strategies
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
                🍨 Buy and sell tokens straight from the chat with non-custodial strategy vaults.
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
                Ten integrations watched in near-real-time — DeFi loans, NFT markets, payments,
                rewards. <a className="text-sky-300 underline" href="#dapps">See them all ↓</a>
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* DAPPS INTEGRATIONS */}
      <section id="dapps" className="max-w-6xl mx-auto px-5 py-16">
        <h2 className="text-3xl font-extrabold text-white text-center">
          Every dApp you use, <span className="text-sky-400">watched</span>
        </h2>
        <p className="text-white/45 text-sm text-center mt-2 mb-10 max-w-xl mx-auto">
          Add up to 20 wallets to your watchlist. Whenever an event touches one of them — on
          any of these protocols — the bot tells you, with the numbers that matter.
        </p>
        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-4">
          {DAPPS.map((dapp) => (
            <div key={dapp.name} className="glass rounded-2xl p-5 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <p className="font-bold text-white">
                  {dapp.href ? (
                    <a className="hover:text-sky-300" href={dapp.href}
                       {...(dapp.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                      {dapp.name}
                    </a>
                  ) : dapp.name}
                  {dapp.extra && <span className="ml-2 text-xs">{dapp.extra}</span>}
                </p>
                <Badge label={dapp.badge} />
              </div>
              <p className="text-sm text-white/45">{dapp.text}</p>
            </div>
          ))}
        </div>
        <div className="glass rounded-2xl p-6 mt-6 text-sm text-white/55 max-w-3xl mx-auto text-center">
          Positions are recomputed in <b className="text-white/80">near-real-time</b> on every
          oracle refresh, interest accrual and price update. Alerts fire when a health metric
          crosses a threshold <b className="text-white/80">in either direction</b>, and every
          message carries its own threshold legend so the headline number reads at a glance.
        </div>
      </section>

      {/* STRATEGIES */}
      <section className="max-w-6xl mx-auto px-5 py-14 text-center">
        <h2 className="text-4xl font-extrabold text-white">
          🍨 Deposit once. <span className="sundae-text">Buy with one tap.</span>
        </h2>
        <p className="text-white/50 mt-3 max-w-lg mx-auto">
          A strategy is your own on-chain vault: it keeps staking, only trades within your
          limits, and you can withdraw whenever you like. The bot can trade —{" "}
          <b className="text-white/75">it can never withdraw your funds.</b>
        </p>
        <Link
          className="inline-block mt-7 tg-btn px-8 py-3.5 rounded-full font-bold hover:opacity-90"
          href="/strategies"
        >
          Open a strategy →
        </Link>
        <p className="text-[12px] text-white/35 mt-6">
          🔒 Non-custodial · orders bounded by amount, fee and time · powered by{" "}
          <a href="https://sundae.fi" target="_blank" rel="noopener noreferrer"
             className="sundae-text font-bold hover:opacity-80">
            🍨 SundaeSwap v3
          </a>
        </p>
      </section>

      {/* TRUST */}
      <section className="max-w-6xl mx-auto px-5 py-10">
        <div className="glass rounded-3xl p-8 text-center">
          <h2 className="text-xl font-extrabold text-white">Built by EASY1 Stake Pool</h2>
          <p className="text-white/50 text-sm mt-3 max-w-2xl mx-auto">
            Cardano stake pool operator since 2021 · SundaeSwap scooper · Butane oracle
            operator · Midnight validator. The infrastructure behind Ada Watch runs the same
            chain it watches — and the code is{" "}
            <a className="text-sky-300 underline" href="https://github.com/easy1staking-com"
               target="_blank" rel="noopener noreferrer">open source</a>.
          </p>
        </div>
      </section>

      {/* COMMANDS TEASER */}
      <section className="max-w-6xl mx-auto px-5 py-10">
        <div className="glass rounded-3xl p-8">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-2xl font-extrabold text-white">One command away</h2>
              <p className="text-white/45 text-sm mt-1">Identical on Telegram and Discord.</p>
            </div>
            <Link className="glass text-sm font-bold px-5 py-2.5 rounded-full hover:bg-white/10" href="/commands">
              All commands →
            </Link>
          </div>
          <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm mt-6">
            <p><code className="text-sky-300">/add $handle</code> <span className="text-white/45">— start watching</span></p>
            <p><code className="text-sky-300">/check</code> <span className="text-white/45">— DeFi status, all wallets</span></p>
            <p><code className="text-sky-300">/balance</code> <span className="text-white/45">— wallet balances</span></p>
            <p><code className="text-sky-300">/strategies</code> <span className="text-white/45">— your trading vaults</span></p>
          </div>
        </div>
      </section>

      {/* DELEGATION ASK */}
      <section className="max-w-6xl mx-auto px-5 py-14 text-center">
        <h2 className="text-2xl font-extrabold text-white">Ada Watch is free. Keeping it free is simples.</h2>
        <p className="text-white/50 mt-3 max-w-xl mx-auto">
          If you like the bot, delegate to the <b className="text-white/80">EASY1 Stake Pool</b> —
          same rewards for you, and it keeps your wallets, loans and NFTs watched 24/7 while the
          bot keeps improving.
        </p>
        <a
          className="inline-block mt-6 tg-btn px-8 py-3.5 rounded-full font-bold hover:opacity-90"
          href="https://www.easy1staking.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Delegate to EASY1 →
        </a>
      </section>
    </main>
  );
}
