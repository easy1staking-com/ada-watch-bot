"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import AdaWatchLogo from "@/components/AdaWatchLogo";

const DISMISS_KEY = "adawatch.nudge.dismissedUntil";
const SHOW_AFTER_MS = 15_000; // genuine dwell, not an ambush
const SNOOZE_DAYS = 7;
const CLICKED_DAYS = 60; // they've seen it through — leave them alone for a long time

export default function DelegationNudge() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // never interrupt someone mid-deposit
    if (pathname?.startsWith("/strategies/deposit") || pathname?.startsWith("/delegate")) return;
    const until = Number(localStorage.getItem(DISMISS_KEY) ?? 0);
    if (Date.now() < until) return;
    const timer = setTimeout(() => setVisible(true), SHOW_AFTER_MS);
    return () => clearTimeout(timer);
  }, [pathname]);

  const snooze = (days: number) => {
    localStorage.setItem(DISMISS_KEY, String(Date.now() + days * 86_400_000));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-5 right-5 z-40 max-w-[300px] glass rounded-3xl rounded-br-lg p-5 bg-[#0e1e35]/95 shadow-[0_20px_60px_-15px_rgba(0,0,0,.7)]"
      style={{ animation: "nudge-in .45s cubic-bezier(.2,.9,.3,1.2) both" }}
    >
      <style>{`@keyframes nudge-in { from { opacity: 0; transform: translateY(24px) scale(.95); } to { opacity: 1; transform: none; } }`}</style>
      <button
        onClick={() => snooze(SNOOZE_DAYS)}
        aria-label="Dismiss"
        className="absolute top-3 right-3 w-6 h-6 grid place-items-center rounded-full text-white/40 hover:text-white hover:bg-white/10 text-xs"
      >
        ✕
      </button>
      <div className="flex items-start gap-3">
        <span className="shrink-0"><AdaWatchLogo size={36} id="awg-nudge" /></span>
        <div>
          <p className="text-sm text-white/80 leading-snug">
            Psst — Ada Watch is <b className="text-white">free</b>, and it stays free thanks to
            EASY1 delegators. Same staking rewards for you, more watching for everyone.
          </p>
          <div className="flex items-center gap-3 mt-3">
            <a
              href="/delegate"
              onClick={() => snooze(CLICKED_DAYS)}
              className="tg-btn text-xs font-bold px-4 py-2 rounded-full hover:opacity-90"
            >
              Delegate to EASY1
            </a>
            <button
              onClick={() => snooze(SNOOZE_DAYS)}
              className="text-xs text-white/40 hover:text-white"
            >
              maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
