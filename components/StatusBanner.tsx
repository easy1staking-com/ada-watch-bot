"use client";

import type { FriendlyError, Severity } from "@/lib/errors";

const STYLES: Record<Severity, { box: string; icon: string }> = {
  info: { box: "border-sky-400/30 bg-sky-400/10 text-sky-100", icon: "💡" },
  warning: { box: "border-amber-400/30 bg-amber-400/10 text-amber-100", icon: "⚠️" },
  error: { box: "border-rose-400/30 bg-rose-400/10 text-rose-100", icon: "❌" },
};

/** Severity-styled message box: calm for expected events, loud only when it matters. */
export default function StatusBanner({
  message,
  onDismiss,
}: {
  message: FriendlyError;
  onDismiss?: () => void;
}) {
  const style = STYLES[message.severity];
  return (
    <div className={`rounded-2xl border px-4 py-3 text-sm ${style.box}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-bold">
            {style.icon} {message.title}
          </p>
          <p className="mt-1 opacity-80">{message.detail}</p>
          {message.raw && (
            <details className="mt-2 opacity-60">
              <summary className="cursor-pointer text-xs">Technical details</summary>
              <p className="mt-1 text-xs break-all font-mono">{message.raw}</p>
            </details>
          )}
        </div>
        {onDismiss && (
          <button onClick={onDismiss} aria-label="Dismiss" className="opacity-60 hover:opacity-100 shrink-0">
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
