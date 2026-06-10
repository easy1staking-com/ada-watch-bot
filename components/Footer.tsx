import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-10">
      <div className="max-w-6xl mx-auto px-5 py-8 text-sm text-white/35 flex flex-col md:flex-row gap-3 justify-between">
        <span>
          👁 Ada Watch ·{" "}
          <a className="hover:text-white" href="https://www.easy1staking.com" target="_blank" rel="noopener noreferrer">
            easy1staking
          </a>
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
          <a className="hover:text-white" href="mailto:info.easy1staking@gmail.com">Support</a>
        </span>
      </div>
    </footer>
  );
}
