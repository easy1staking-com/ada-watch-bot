import Image from "next/image";
import TelegramIcon from "@/components/TelegramIcon";

export const metadata = {
  title: "Get started — Ada Watch Bot",
  description: "How to start using Ada Watch Bot on Telegram and Discord.",
};

const discordSteps = [
  { img: "00-discover.png", text: "Open Discord and click the Discover button in the sidebar." },
  { img: "01-apps.png", text: "Go to the Apps section." },
  { img: "02-search-for-ada-watch.png", text: "Search for “Ada Watch”." },
  { img: "03-select-ada-watch.png", text: "Select Ada Watch Bot from the results." },
  { img: "05-add-ada-watch-to-apps.png", text: "Add Ada Watch to your Apps and authorize it." },
];

export default function GetStarted() {
  return (
    <main className="max-w-4xl mx-auto px-5 py-16">
      <h1 className="text-4xl font-extrabold text-white">Get started</h1>
      <p className="text-white/50 mt-3">
        Ada Watch Bot works on both Telegram and Discord, with identical commands. Anywhere an
        address is accepted you can use an{" "}
        <a className="text-sky-300 underline" href="https://handle.me/" target="_blank" rel="noopener noreferrer">
          Ada Handle
        </a>{" "}
        (<code className="text-sky-300">$yourhandle</code>) instead.
      </p>

      <section className="glass rounded-3xl p-8 mt-10">
        <h2 className="text-2xl font-extrabold text-white inline-flex items-center gap-2"><TelegramIcon size={28} /> Telegram</h2>
        <p className="text-white/55 mt-2">
          Open{" "}
          <a className="text-sky-300 underline" href="https://t.me/AdaWatchBot" target="_blank" rel="noopener noreferrer">
            t.me/AdaWatchBot
          </a>{" "}
          and start chatting. Add your first address with{" "}
          <code className="text-sky-300">/add $yourhandle</code>.
        </p>
        <p className="text-white/40 text-sm mt-3">
          Telegram extras: scheduled daily checks (<code>/check set 09:00</code>), timezone
          support (<code>/tz</code>), and the full command list via <code>/commands</code>.
        </p>
      </section>

      <section className="glass rounded-3xl p-8 mt-6">
        <h2 className="text-2xl font-extrabold text-white">🎮 Discord</h2>
        <ol className="mt-4 space-y-8">
          {discordSteps.map((step, i) => (
            <li key={step.img}>
              <p className="text-white/60 mb-3">
                <span className="inline-grid place-items-center w-7 h-7 rounded-full tg-btn font-bold text-white mr-2">
                  {i + 1}
                </span>
                {step.text}
              </p>
              <Image
                src={`/images/discord/${step.img}`}
                alt={step.text}
                width={900}
                height={500}
                className="rounded-xl border border-white/10"
              />
            </li>
          ))}
        </ol>
      </section>

      <section className="glass rounded-3xl p-8 mt-6">
        <h2 className="text-2xl font-extrabold text-white">Commands</h2>
        <div className="mt-4 space-y-2 text-sm">
          {[
            ["/add address", "Add an address (payment, staking, or $adahandle) to your watchlist."],
            ["/remove address", "Remove an address from your watchlist."],
            ["/check", "Check status across every watched address (Liqwid, Indigo, FluidTokens)."],
            ["/check address", "Check the status of a single address."],
            ["/list", "List every address on your watchlist."],
            ["/help", "Show the welcome / help message."],
          ].map(([cmd, desc]) => (
            <p key={cmd}>
              <code className="text-sky-300">{cmd}</code>{" "}
              <span className="text-white/45">— {desc}</span>
            </p>
          ))}
        </div>
      </section>

      <p className="text-white/40 text-sm mt-8">
        Issues, questions, feature requests?{" "}
        <a className="text-sky-300 underline" href="mailto:info.easy1staking@gmail.com">
          info.easy1staking@gmail.com
        </a>
      </p>
    </main>
  );
}
