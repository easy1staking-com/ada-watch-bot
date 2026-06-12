export const metadata = {
  title: "Commands — Ada Watch Bot",
  description: "Every Ada Watch Bot command on Telegram and Discord.",
};

const SHARED: [string, string][] = [
  ["/add address", "Add an address (payment, staking, or $adahandle) to your watchlist."],
  ["/remove address", "Remove an address from your watchlist."],
  ["/check", "Check status across every watched address (Liqwid, Indigo, FluidTokens)."],
  ["/check address", "Check the status of a single address."],
  ["/balance", "Balances for watched wallets — or pass any address / $handle."],
  ["/list", "List every address on your watchlist."],
  ["/help", "Show the welcome / help message."],
];

const TELEGRAM: [string, string][] = [
  ["/strategies", "🍨 Your SundaeSwap trading vaults: pairing key, deposit link, one-tap buys and sells."],
  ["/commands", "List every command with a one-line description."],
  ["/check set HH:mm", "Schedule a recurring daily status check at a chosen time."],
  ["/check unset HH:mm", "Remove a scheduled check."],
  ["/check list", "List your scheduled checks."],
  ["/check clear", "Remove all scheduled checks."],
  ["/tz", "View or change the timezone used for scheduled checks."],
];

function CommandTable({ rows }: { rows: [string, string][] }) {
  return (
    <div className="space-y-3 mt-4">
      {rows.map(([cmd, desc]) => (
        <p key={cmd} className="flex flex-col sm:flex-row sm:gap-4">
          <code className="text-sky-300 shrink-0 sm:w-44">{cmd}</code>
          <span className="text-white/50 text-sm">{desc}</span>
        </p>
      ))}
    </div>
  );
}

export default function Commands() {
  return (
    <main className="max-w-3xl mx-auto px-5 py-16">
      <h1 className="text-4xl font-extrabold text-white">Commands</h1>
      <p className="text-white/50 mt-3">
        The core commands behave identically on Telegram and Discord.
      </p>

      <section className="glass rounded-3xl p-8 mt-8">
        <h2 className="text-xl font-extrabold text-white">Telegram &amp; Discord</h2>
        <CommandTable rows={SHARED} />
      </section>

      <section className="glass rounded-3xl p-8 mt-6">
        <h2 className="text-xl font-extrabold text-white">Telegram extras</h2>
        <CommandTable rows={TELEGRAM} />
      </section>
    </main>
  );
}
