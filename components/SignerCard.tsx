"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function SignerCardInner() {
  const params = useSearchParams();
  const signer = params.get("signer")?.toLowerCase() ?? "";
  const valid = /^[0-9a-f]{64}$/.test(signer);

  if (!valid) {
    return (
      <>
        <p className="text-sm text-white/45 mt-1 mb-4">
          Type <span className="text-sky-300 font-mono">/strategies</span> in Telegram and tap
          the link — or scan the QR from desktop.
        </p>
        <div className="font-mono text-center text-2xl tracking-[.4em] glass rounded-xl py-3 text-sky-300">
          •••••
        </div>
      </>
    );
  }

  return (
    <>
      <p className="text-sm text-white/45 mt-1 mb-4">
        <span className="text-emerald-300 font-bold">✓ Linked to your AdaWatch account.</span>{" "}
        This signer key will be baked into your strategy when deposits go live.
      </p>
      <div
        className="font-mono text-center text-[11px] break-all glass rounded-xl py-3 px-3 text-sky-300"
        title="Your personal strategy signer verification key"
      >
        {signer.slice(0, 16)}…{signer.slice(-16)}
      </div>
    </>
  );
}

export default function SignerCard() {
  return (
    <Suspense
      fallback={
        <div className="font-mono text-center text-2xl tracking-[.4em] glass rounded-xl py-3 text-sky-300">
          •••••
        </div>
      }
    >
      <SignerCardInner />
    </Suspense>
  );
}
