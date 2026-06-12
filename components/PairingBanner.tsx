"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

/**
 * Shows ONLY when the user lands here from the Telegram /strategies deep link
 * (?signer=<vkey>). This is the real pairing flow — everything else on the page
 * is explainer. Renders nothing otherwise.
 */
function PairingBannerInner() {
  const params = useSearchParams();
  const signer = params.get("signer")?.toLowerCase() ?? "";
  if (!/^[0-9a-f]{64}$/.test(signer)) return null;

  return (
    <div className="max-w-xl mx-auto mb-10 glass rounded-3xl p-6 border border-emerald-400/30 text-center">
      <p className="text-emerald-300 font-bold">✓ Linked to your AdaWatch account</p>
      <p className="text-sm text-white/50 mt-1">
        Your personal signer key will be baked into the vault you create.
      </p>
      <div
        className="font-mono text-[11px] break-all glass rounded-xl py-2.5 px-3 text-sky-300 mt-3"
        title="Your personal strategy signer verification key"
      >
        {signer.slice(0, 16)}…{signer.slice(-16)}
      </div>
      <a
        href={`/strategies/deposit?signer=${signer}`}
        className="tg-btn block text-center w-full mt-4 py-3 rounded-xl font-bold hover:opacity-90"
      >
        Create your vault →
      </a>
    </div>
  );
}

export default function PairingBanner() {
  return (
    <Suspense fallback={null}>
      <PairingBannerInner />
    </Suspense>
  );
}
