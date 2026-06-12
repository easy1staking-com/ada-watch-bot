import { BRAND } from "@/lib/brand";

/** The Ada Watch mark — "₳ Broadcast": the Cardano glyph with sideways wavefronts. */
export default function AdaWatchLogo({
  size = 40,
  box = true,
  id = "awg",
}: {
  size?: number;
  box?: boolean;
  id?: string;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 96 96" style={{ display: "block" }} aria-label="Ada Watch">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={BRAND.gradFrom} />
          <stop offset="1" stopColor={BRAND.gradTo} />
        </linearGradient>
      </defs>
      {box && <rect width="96" height="96" rx="24" fill={BRAND.box} stroke={`url(#${id})`} strokeWidth="5" />}
      <path d="M37.1 32.4 A19 19 0 0 0 37.1 63.6" fill="none" stroke={BRAND.waveInner} strokeWidth="4" strokeLinecap="round" opacity=".85" />
      <path d="M30 26.6 A28 28 0 0 0 30 69.4" fill="none" stroke={BRAND.waveOuter} strokeWidth="4" strokeLinecap="round" opacity=".4" />
      <path d="M58.9 32.4 A19 19 0 0 1 58.9 63.6" fill="none" stroke={BRAND.waveInner} strokeWidth="4" strokeLinecap="round" opacity=".85" />
      <path d="M66 26.6 A28 28 0 0 1 66 69.4" fill="none" stroke={BRAND.waveOuter} strokeWidth="4" strokeLinecap="round" opacity=".4" />
      <path d="M42 58 L48 39 L54 58 M40.5 49.5 L55.5 49.5 M40.5 54.5 L55.5 54.5" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
