import Link from "next/link";

export default function Nav() {
  return (
    <nav className="sticky top-0 z-30 backdrop-blur-md bg-[#0b1320]/75 border-b border-white/10">
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-extrabold text-lg text-white">
          <span className="w-8 h-8 rounded-xl tg-btn grid place-items-center">👁</span>
          Ada Watch
        </Link>
        <div className="hidden md:flex gap-8 text-sm font-medium text-white/55">
          <Link className="hover:text-white" href="/#features">Features</Link>
          <Link className="hover:text-white" href="/get-started">Get started</Link>
          <Link className="text-sky-400 font-semibold" href="/strategies">
            🍨 Strategies{" "}
            <span className="ml-1 text-[10px] align-top sundae-grad text-white px-1.5 py-0.5 rounded-full">
              NEW
            </span>
          </Link>
        </div>
        <a
          className="tg-btn text-sm font-bold px-5 py-2.5 rounded-full hover:opacity-90"
          href="https://t.me/AdaWatchBot"
          target="_blank"
          rel="noopener noreferrer"
        >
          Open in Telegram
        </a>
      </div>
    </nav>
  );
}
