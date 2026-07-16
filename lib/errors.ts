/**
 * Maps raw failures (Evolution SDK tagged errors, CIP-30 wallet codes, fetch
 * failures) to a severity + human message, so the UI never shows a stack trace.
 *
 * Severity semantics:
 * - info:    expected user actions (declined signature, vault already gone) — calm tone
 * - warning: recoverable situations (locked wallet, low funds, network hiccup) — say how
 * - error:   something genuinely wrong (script refused, unknown failure) — apologise + raw detail
 */

export type Severity = "info" | "warning" | "error";

export interface FriendlyError {
  severity: Severity;
  title: string;
  detail: string;
  /** Raw underlying message for the collapsible "technical details" section. */
  raw?: string;
}

function messageOf(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (typeof e === "object" && e !== null) {
    const anyE = e as { message?: unknown; info?: unknown };
    if (typeof anyE.message === "string") return anyE.message;
    if (typeof anyE.info === "string") return anyE.info; // CIP-30 APIError shape
    try {
      return JSON.stringify(e);
    } catch {
      /* fallthrough */
    }
  }
  return String(e);
}

function cip30Code(e: unknown): number | undefined {
  if (typeof e === "object" && e !== null && "code" in e) {
    const code = (e as { code: unknown }).code;
    if (typeof code === "number") return code;
  }
  return undefined;
}

/** Evolution SDK errors are Effect tagged errors — _tag is the reliable discriminator. */
function tagOf(e: unknown): string | undefined {
  if (typeof e === "object" && e !== null && "_tag" in e) {
    const tag = (e as { _tag: unknown })._tag;
    if (typeof tag === "string") return tag;
  }
  return undefined;
}

export function classifyError(e: unknown): FriendlyError {
  const raw = messageOf(e);
  const msg = raw.toLowerCase();
  const code = cip30Code(e);
  const tag = tagOf(e);

  // ---- Evolution SDK tagged errors (see evolution docs, advanced/error-handling) ----
  if (tag === "CoinSelectionError") {
    return {
      severity: "warning",
      title: "Not enough funds",
      detail: "Your wallet doesn't have enough available ada for this transaction (amount + network fee). Free up or add some ada and retry.",
      raw,
    };
  }
  if (tag === "EvaluationError") {
    return {
      severity: "error",
      title: "The contract refused this transaction",
      detail: "The on-chain validator rejected it, so nothing was spent. If this keeps happening, ping us on Telegram with the details below.",
      raw,
    };
  }
  if (tag === "ProviderError") {
    return {
      severity: "warning",
      title: "Network hiccup",
      detail: "The chain query service didn't answer properly. This is almost always temporary — try again in a few seconds.",
      raw,
    };
  }

  // ---- info: the user changed their mind, or the world moved on ----
  if (code === 2 || /declined|user reject|denied|cancell?ed by user/.test(msg)) {
    return {
      severity: "info",
      title: "Signature declined",
      detail: "No problem — nothing was signed and nothing left your wallet.",
    };
  }
  if (/not found on-chain|already executed or cancelled/.test(msg)) {
    return {
      severity: "info",
      title: "That vault is already gone",
      detail: "It was executed or cancelled in the meantime — refreshing the list will tidy this up.",
      raw,
    };
  }

  // ---- warning: recoverable, tell them how ----
  if (code === -3 || code === -4 || /locked|no account|permission|unauthorized|api.*revoked/.test(msg)) {
    return {
      severity: "warning",
      title: "Wallet unavailable",
      detail: "Your wallet looks locked or the connection was revoked. Unlock it (or reconnect top-right) and try again.",
      raw,
    };
  }
  if (/insufficient collateral|no suitable utxos.*collateral/.test(msg)) {
    return {
      severity: "warning",
      title: "Not enough spare ada for collateral",
      detail:
        "Script transactions need ~1 ada of plain-ada collateral (it is only ever spent if the contract fails — normally it never leaves your wallet). Top up a little loose ada and retry.",
      raw,
    };
  }
  if (/insufficient|not enough|exceeds.*balance|utxo balance/.test(msg)) {
    return {
      severity: "warning",
      title: "Not enough funds",
      detail: "Your wallet doesn't have enough available ada for this transaction (amount + network fee). Free up or add some ada and retry.",
      raw,
    };
  }
  if (/providererror|blockfrost .* failed|koios .* failed|fetch failed|networkerror|load failed|timeout|50[234]/.test(msg)) {
    return {
      severity: "warning",
      title: "Network hiccup",
      detail: "The chain query service didn't answer properly. This is almost always temporary — try again in a few seconds.",
      raw,
    };
  }
  if (/bad ?inputs|value ?not ?conserved|outsidevalidityinterval|stale/.test(msg)) {
    return {
      severity: "warning",
      title: "The chain moved under us",
      detail: "A coin this transaction used was just spent elsewhere (often a wallet auto-refresh). Refresh and try again — nothing was lost.",
      raw,
    };
  }

  // ---- error: genuinely broken ----
  if (/script|redeemer|validation|evaluat|trace|plutus/.test(msg)) {
    return {
      severity: "error",
      title: "The contract refused this transaction",
      detail: "The on-chain validator rejected it, so nothing was spent. If this keeps happening, ping us on Telegram with the details below.",
      raw,
    };
  }
  return {
    severity: "error",
    title: "Something went wrong",
    detail: "Nothing was spent. Try once more — and if it persists, ping us on Telegram with the details below.",
    raw,
  };
}
