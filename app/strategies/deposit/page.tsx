import DepositWizard from "@/components/DepositWizard";

export const metadata = {
  title: "Open a strategy — Ada Watch Bot",
  description: "Guided SundaeSwap strategy deposit: one-shot buy, trading vault, or DCA.",
};

export default function Deposit() {
  return (
    <main className="max-w-xl mx-auto px-5 py-16">
      <div className="text-center mb-8">
        <a href="https://sundae.fi" target="_blank" rel="noopener noreferrer"
           className="inline-flex items-center gap-2 text-[12px] font-bold text-white sundae-grad px-4 py-1.5 rounded-full hover:opacity-90">
          🍨 In collaboration with SundaeSwap
        </a>
        <h1 className="mt-5 text-3xl md:text-4xl font-extrabold text-white">Open a strategy</h1>
      </div>
      <DepositWizard />
    </main>
  );
}
