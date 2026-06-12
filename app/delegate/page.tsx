import DelegateFlow from "@/components/DelegateFlow";

export const metadata = {
  title: "Support Ada Watch — delegate to EASY1",
  description:
    "Ada Watch is free and stays free thanks to EASY1 delegators. Delegate in one transaction, same rewards, more watching.",
};

const PERKS = [
  ["⚡", "Fastest Cardano bot", "Notifications land the moment events hit the chain — the bot runs its own node and indexers, no third-party lag."],
  ["🔭", "Ten dApps watched", "Liqwid, Indigo, FluidTokens, JPG Store, SundaeSwap and more — loans, NFTs, payments, rewards."],
  ["🍨", "Non-custodial trading", "Strategy vaults that buy and sell from chat without ever holding your keys."],
  ["🆓", "Free. Actually free.", "No subscription, no fees, no token. Sponsored by the EASY1 Stake Pool."],
] as const;

export default function Delegate() {
  return (
    <main className="max-w-3xl mx-auto px-5 py-16">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white">
          Keep Ada Watch <span className="fade-text">free for everyone</span>
        </h1>
        <p className="text-white/50 mt-4 max-w-xl mx-auto">
          Ada Watch is sponsored by the <b className="text-white/80">EASY1 Stake Pool</b>. Your
          delegation pays for the nodes, the indexers and the late-night features — and costs
          you nothing: you earn the same staking rewards as with any healthy pool.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        {PERKS.map(([emoji, title, text]) => (
          <div key={title} className="glass rounded-2xl p-5">
            <p className="text-2xl">{emoji}</p>
            <p className="font-bold text-white mt-2">{title}</p>
            <p className="text-sm text-white/45 mt-1">{text}</p>
          </div>
        ))}
      </div>

      <DelegateFlow />

      <p className="text-center text-[12px] text-white/35 mt-8">
        EASY1 — Cardano stake pool since 2021 · SundaeSwap scooper · Butane oracle operator ·
        Midnight validator ·{" "}
        <a className="text-sky-300 underline" href="https://www.easy1staking.com" target="_blank" rel="noopener noreferrer">
          easy1staking.com
        </a>
      </p>
    </main>
  );
}
