import PairingBanner from "@/components/PairingBanner";
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

      <PairingBanner />

      {/* pure explainer: framed mini-screens read as pictures, nothing here is operable */}
      <p className="text-center text-[12px] font-bold tracking-[.25em] text-white/35 mb-5">
        HOW IT WORKS
      </p>
      <div className="grid md:grid-cols-3 gap-6 select-none" aria-hidden="true">
        <div className="glass rounded-3xl p-7">
          <span className="w-9 h-9 rounded-full tg-btn grid place-items-center font-bold">1</span>
          <p className="font-bold text-white mt-4">Pair with the bot</p>
          <p className="text-sm text-white/45 mt-1">
            Type <span className="text-sky-300 font-mono">/strategies</span> in Telegram. The
            bot replies with a link that ties your chat to your personal signer key.
          </p>
          <div className="pointer-events-none mt-5 mx-auto w-48 rounded-[1.6rem] border border-white/15 bg-[#0e1621] p-1.5">
            <div className="mx-auto w-14 h-1 rounded-full bg-black/70 mt-1 mb-1.5" />
            <div className="rounded-[1.2rem] bg-[#17212b] p-2 space-y-1.5 text-[10px]">
              <div className="bubble-bot p-2 max-w-[85%]">
                Tap to pair ↗<br />
                <span className="text-white/35">your signer: c008dc…3139</span>
              </div>
              <div className="bg-[#0e1621] rounded-full px-2.5 py-1 text-white/40 font-mono">
                /strategies
              </div>
            </div>
          </div>
        </div>

        <div className="glass rounded-3xl p-7">
          <span className="w-9 h-9 rounded-full tg-btn grid place-items-center font-bold">2</span>
          <p className="font-bold text-white mt-4">Deposit ADA into a vault</p>
          <p className="text-sm text-white/45 mt-1">
            The deposit wizard connects your wallet; you pick an amount, sign once. The vault
            is an on-chain order <b className="text-white/70">you</b> own — it keeps staking
            and you can withdraw anytime.
          </p>
          <div className="pointer-events-none mt-5 mx-auto w-48 rounded-xl border border-white/15 bg-[#0e1621] overflow-hidden">
            <div className="flex items-center gap-1 px-2.5 py-1.5 bg-white/5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400/60" />
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400/60" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/60" />
              <span className="text-[8px] text-white/30 ml-1.5 font-mono">adawatchbot.xyz</span>
            </div>
            <div className="p-3 text-center">
              <p className="text-[10px] text-white/40">Deposit</p>
              <p className="text-xl font-extrabold text-white">
                10 <span className="text-sky-400">₳</span>
              </p>
              <div className="tg-btn rounded-lg py-1.5 text-[10px] font-bold mt-2 opacity-80">
                Sign with your wallet
              </div>
            </div>
          </div>
        </div>

        <div className="glass rounded-3xl p-7 sundae-ring">
          <span className="w-9 h-9 rounded-full sundae-grad grid place-items-center font-bold">3</span>
          <p className="font-bold text-white mt-4">Trade with one tap</p>
          <p className="text-sm text-white/45 mt-1">
            The vault appears in your Telegram chat with token buttons. Tap, confirm the live
            quote, done — SundaeSwap&apos;s scoopers execute it on-chain.
          </p>
          <div className="pointer-events-none mt-5 mx-auto w-48 rounded-[1.6rem] border border-white/15 bg-[#0e1621] p-1.5">
            <div className="mx-auto w-14 h-1 rounded-full bg-black/70 mt-1 mb-1.5" />
            <div className="rounded-[1.2rem] bg-[#17212b] p-2 space-y-1.5 text-[10px]">
              <div className="bubble-bot p-2 max-w-[90%]">
                ⚡ Vault · <b>10 ₳</b>{" "}
                <span className="text-emerald-300 text-[8px] font-bold">● ARMED</span>
              </div>
              <div className="grid grid-cols-3 gap-1 text-center">
                <span className="kb-btn rounded-md py-1">🐶</span>
                <span className="kb-btn rounded-md py-1">🐍</span>
                <span className="kb-btn rounded-md py-1">💵</span>
              </div>
              <div className="bubble-bot p-2 max-w-[90%]">
                ✅ Swapped <b className="text-emerald-400">5 ₳ → 120M HOSKY</b>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* the one real call to action on this page */}
      <div className="text-center mt-10 mb-14">
        <a
          href="/strategies/deposit"
          className="tg-btn inline-block px-10 py-4 rounded-full font-bold text-lg hover:opacity-90"
        >
          Open the deposit wizard →
        </a>
        <p className="text-[12px] text-white/35 mt-3">
          Not paired yet? Start with <span className="text-sky-300 font-mono">/strategies</span>{" "}
          in{" "}
          <a
            href="https://t.me/AdaWatchBot"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-300 underline"
          >
            @AdaWatchBot
          </a>{" "}
          so the vault is wired to your chat.
        </p>
      </div>

      <div className="max-w-xl mx-auto mb-10">
        <VaultList />
      </div>

      <div className="glass rounded-3xl p-8 mt-10">
        <h2 className="text-xl font-extrabold text-white mb-4">How is this non-custodial?</h2>
        <div className="grid md:grid-cols-2 gap-x-10 gap-y-3 text-sm text-white/55 leading-relaxed">
          <p>
            Your deposit sits in a <b className="text-white/80">SundaeSwap v3 strategy order</b> —
            a UTxO at the Sundae order contract that names <b className="text-white/80">your</b>{" "}
            key as owner and Ada Watch&apos;s key only as the trade signer. It even keeps staking
            to your own pool while it rests.
          </p>
          <p>
            The contract caps what the bot can do: trade only on the pool{" "}
            <b className="text-white/80">you locked</b>, protocol fee capped at what you agreed,
            results payable <b className="text-white/80">only</b> to your vault or your wallet.
            The one thing you trust the bot with is quoting a fair minimum price per trade — and
            even a bad quote can&apos;t send funds anywhere else.
          </p>
          <p>
            Every trade&apos;s result goes where <b className="text-white/80">you</b> chose at
            deposit: straight to your wallet (one-shot) or back into the vault (trading/DCA).
            Trades are executed by SundaeSwap&apos;s scooper network — the bot only signs intents.
          </p>
          <p>
            You can <b className="text-white/80">cancel at any time</b> with your own wallet
            signature and everything returns to you — no permission needed from the bot, from
            Sundae, or from anyone. Even if Ada Watch vanished tomorrow, your cancel still works.
          </p>
        </div>
        <p className="text-[12px] text-white/40 mt-6">
          Don&apos;t trust, verify — the official SundaeSwap sources:{" "}
          <a className="text-sky-300 underline" href="https://cdn.sundaeswap.finance/SundaeV3.pdf" target="_blank" rel="noopener noreferrer">V3 whitepaper</a>
          {" · "}
          <a className="text-sky-300 underline" href="https://github.com/SundaeSwap-finance/sundae-contracts" target="_blank" rel="noopener noreferrer">on-chain contracts</a>
          {" · "}
          <a className="text-sky-300 underline" href="https://github.com/SundaeSwap-finance/sundae-strategies" target="_blank" rel="noopener noreferrer">strategies framework</a>
          {" · "}
          <a className="text-sky-300 underline" href="https://github.com/SundaeSwap-finance/sundae-sdk" target="_blank" rel="noopener noreferrer">SDK</a>
        </p>
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
