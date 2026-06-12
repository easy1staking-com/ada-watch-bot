import AdaWatchLogo from "@/components/AdaWatchLogo";
import { BRAND, logoSvg } from "@/lib/brand";

export const metadata = {
  title: "Brand toolkit — Ada Watch",
  robots: { index: false, follow: false },
};

const svgDownload = (box: boolean) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(logoSvg(512, { box, id: "awg-dl" }))}`;

const COLORS: [string, string][] = [
  ["Navy (background)", BRAND.navy],
  ["Box (mark fill)", BRAND.box],
  ["Gradient from", BRAND.gradFrom],
  ["Gradient to", BRAND.gradTo],
  ["Wave inner", BRAND.waveInner],
  ["Emerald (live/armed)", BRAND.emerald],
];

export default function Brand() {
  return (
    <main className="max-w-4xl mx-auto px-5 py-16">
      <h1 className="text-4xl font-extrabold text-white">Ada Watch — brand toolkit</h1>
      <p className="text-white/45 mt-2 text-sm">
        The mark is <b className="text-white/70">&ldquo;₳ Broadcast&rdquo;</b>: the Cardano glyph as the
        source, wavefronts propagating outward — we watch ada, and we tell you. Unlisted page.
      </p>

      {/* the mark */}
      <section className="glass rounded-3xl p-8 mt-8">
        <h2 className="text-xl font-extrabold text-white mb-6">The mark</h2>
        <div className="flex items-end gap-10 flex-wrap">
          {[20, 32, 48, 96, 160].map((s) => (
            <div key={s} className="flex flex-col items-center gap-2">
              <AdaWatchLogo size={s} id={`awg-s${s}`} />
              <span className="text-[11px] text-white/35">{s}px</span>
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-8 flex-wrap">
          <a className="tg-btn text-sm font-bold px-5 py-2.5 rounded-full hover:opacity-90"
             href={svgDownload(true)} download="ada-watch-logo.svg">⬇ SVG (boxed)</a>
          <a className="glass text-sm font-bold px-5 py-2.5 rounded-full hover:bg-white/10"
             href={svgDownload(false)} download="ada-watch-logo-transparent.svg">⬇ SVG (transparent)</a>
        </div>
      </section>

      {/* lockups */}
      <section className="glass rounded-3xl p-8 mt-6">
        <h2 className="text-xl font-extrabold text-white mb-6">Lockups</h2>
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <AdaWatchLogo size={48} id="awg-l1" />
            <span className="text-3xl font-extrabold text-white">Ada Watch</span>
          </div>
          <div className="flex items-center gap-2.5">
            <AdaWatchLogo size={32} id="awg-l2" />
            <span className="text-xl font-extrabold text-white">Ada Watch</span>
          </div>
          <div className="flex flex-col items-center gap-3 py-4">
            <AdaWatchLogo size={96} id="awg-l3" />
            <span className="text-2xl font-extrabold text-white">Ada Watch</span>
            <span className="text-sm text-white/45 -mt-2">Your Cardano wallet, in your pocket.</span>
          </div>
        </div>
      </section>

      {/* X assets */}
      <section className="glass rounded-3xl p-8 mt-6">
        <h2 className="text-xl font-extrabold text-white mb-2">X / social assets</h2>
        <p className="text-white/40 text-sm mb-6">Rendered server-side as PNG — right-click → save, or open the links.</p>
        <div className="flex items-start gap-8 flex-wrap">
          <div>
            <p className="text-sm text-white/55 mb-2">Profile picture (400×400)</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/api/brand/avatar" alt="avatar" width={160} height={160} className="rounded-full border border-white/10" />
            <p className="mt-2"><a className="text-sky-300 underline text-sm" href="/api/brand/avatar" target="_blank">open PNG →</a></p>
          </div>
          <div className="flex-1 min-w-[300px]">
            <p className="text-sm text-white/55 mb-2">Banner (1500×500)</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/api/brand/banner" alt="banner" className="w-full rounded-xl border border-white/10" />
            <p className="mt-2"><a className="text-sky-300 underline text-sm" href="/api/brand/banner" target="_blank">open PNG →</a></p>
          </div>
        </div>
      </section>

      {/* palette */}
      <section className="glass rounded-3xl p-8 mt-6">
        <h2 className="text-xl font-extrabold text-white mb-6">Palette</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {COLORS.map(([name, hex]) => (
            <div key={hex} className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl border border-white/15" style={{ background: hex }} />
              <span className="text-sm"><b className="text-white">{name}</b><br /><code className="text-white/45">{hex}</code></span>
            </div>
          ))}
        </div>
        <p className="text-white/35 text-xs mt-6">
          Usage: the mark stands alone — partner colors (e.g. Sundae pink) never enter the logo.
          Wordmark in Plus Jakarta Sans 800. On light backgrounds use the boxed variant.
        </p>
      </section>
    </main>
  );
}
