import Link from "next/link";
import TelegramIcon from "@/components/TelegramIcon";
import AdaWatchLogo from "@/components/AdaWatchLogo";
import DiscordIcon from "@/components/DiscordIcon";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-10">
      <div className="max-w-6xl mx-auto px-5 py-8 text-sm text-white/35 flex flex-col md:flex-row gap-4 justify-between items-center">
        <span className="flex items-center gap-3">
          <AdaWatchLogo size={20} id="awg-foot" /> Ada Watch ·{" "}
          <a className="hover:text-white" href="https://www.easy1staking.com" target="_blank" rel="noopener noreferrer">
            easy1staking
          </a>
          <a href="https://t.me/AdaWatchBot" target="_blank" rel="noopener noreferrer" title="Telegram"
             className="grid place-items-center hover:opacity-80"><TelegramIcon size={20} /></a>
          <a href="/get-started#discord" title="Discord"
             className="grid place-items-center hover:opacity-80"><DiscordIcon size={20} /></a>
        </span>
        <span className="flex gap-4">
          <Link className="hover:text-white" href="/privacy">Privacy</Link>
          <Link className="hover:text-white" href="/terms">Terms</Link>
          <a
            className="hover:text-white"
            href="https://github.com/easy1staking-com/ada-watch-bot"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <a className="hover:text-white" href="mailto:info.easy1staking@gmail.com">info.easy1staking@gmail.com</a>
        </span>
      </div>
    </footer>
  );
}
