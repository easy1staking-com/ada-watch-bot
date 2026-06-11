"use client";

import { useState } from "react";
import { useWallet } from "@/components/WalletContext";

export default function WalletButton() {
  const { installed, address, walletName, connecting, connect, disconnect } = useWallet();
  const [open, setOpen] = useState(false);

  if (address) {
    return (
      <button
        onClick={disconnect}
        title={`${walletName} — click to disconnect`}
        className="glass text-sm font-bold px-4 py-2.5 rounded-full hover:bg-white/10 font-mono"
      >
        🟢 {address.slice(0, 10)}…{address.slice(-4)}
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        disabled={connecting}
        className="tg-btn text-sm font-bold px-5 py-2.5 rounded-full hover:opacity-90 disabled:opacity-50"
      >
        {connecting ? "Connecting…" : "Connect wallet"}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-52 glass rounded-2xl p-2 z-50 bg-[#0b1320]/95">
          {installed.length === 0 && (
            <p className="text-xs text-white/45 p-3">
              No CIP-30 wallet found — install Eternl or Lace, or open this site in your
              wallet&apos;s dApp browser.
            </p>
          )}
          {installed.map((w) => (
            <button
              key={w.id}
              onClick={() => {
                setOpen(false);
                connect(w.id);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 text-sm font-bold"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={w.icon} alt="" className="w-6 h-6 rounded" />
              <span className="capitalize">{w.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
