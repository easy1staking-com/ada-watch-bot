# Strategy vaults — how the numbers work

Short answers to the questions everyone asks the first time they open a vault.
The exact values below are **protocol parameters that can change** — when in
doubt, trust the live summary the app shows you, not this page.

## Why is my tradeable amount less than my deposit?

Deposit 15 ada and you'll see something like **≈ 11.72 ada tradeable**. Nothing
went missing — two reserves are set aside inside the vault:

| | Amount | What it is |
|---|---|---|
| Batcher reserve | ~1.28 ada | The max fee a SundaeSwap scooper may take **per executed trade**. It has to sit in the vault, ready, or scoopers won't touch the order. |
| Scooper floor | ~2.00 ada | Every Cardano UTxO must keep a minimum of ada. Scoopers require ~2 ada to stay in the vault after a trade — offer more and they silently skip you. |

So: `15.00 − 1.28 − 2.00 = 11.72 ada` you can actually swap in one go.

## Do I ever lose those reserves?

**No.** Cancel the vault and *everything* comes back — the floor, the unused
batcher reserve, your tokens, all of it. The ~1.28 ada is only spent when a
trade actually executes (and it's a cap — the real fee can be less).

## Why does everything say "estimated"?

Three reasons: protocol fees can be re-tuned by SundaeSwap governance, pool
prices move between quoting and execution, and your slippage tolerance sets a
worst case. The app recomputes live numbers every time — the summary you see
right before signing is the one that counts.

## I confirmed a trade but nothing happened. Is it stuck?

Probably not — scoopers **silently skip** orders they can't fill at your
minimum price. Your order simply stays armed and nothing is spent. If the
market comes back within your quote's validity window it can still execute;
otherwise just quote again.

## What's the ~1 ada "collateral" my wallet shows when cancelling?

A Cardano rule for any smart-contract transaction: collateral is only ever
taken if the contract *fails on-chain* — which for a simple owner-cancel
effectively doesn't happen. It normally never leaves your wallet; think of it
as a seatbelt, not a fee.

## Who controls my vault?

You do. The vault sits at SundaeSwap's own order contract with **your** wallet
as the only party able to cancel. The Ada Watch signer key can only choose
trades *within the limits you signed* — the pinned market, the fee cap, the
time window. It cannot withdraw, redirect, or drain anything.

---

Something still unclear? Ping us on [Telegram](https://t.me/AdaWatchBot) — the
bot answers, and so do we.
