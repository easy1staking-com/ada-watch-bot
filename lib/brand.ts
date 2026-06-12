/**
 * Ada Watch brand mark — "₳ Broadcast" (F2): the Cardano glyph as the source,
 * circle-arc wavefronts propagating sideways. Single source of truth for the SVG;
 * the React component, favicons, OG images and the /brand toolkit all derive from here.
 */

export const BRAND = {
  navy: "#0b1320",
  box: "#0e1e35",
  gradFrom: "#2AABEE",
  gradTo: "#3b82f6",
  waveInner: "#5fb9ee",
  waveOuter: "#2AABEE",
  emerald: "#34d399",
};

/**
 * The mark as an SVG string.
 * @param size   rendered px
 * @param opts.box   draw the rounded-rect container (default true; false = transparent glyph+waves only)
 * @param opts.id    unique gradient id when embedding multiple inline copies
 */
export function logoSvg(size: number, opts: { box?: boolean; id?: string } = {}): string {
  const { box = true, id = "awg" } = opts;
  const container = box
    ? `<rect width="96" height="96" rx="24" fill="${BRAND.box}" stroke="url(#${id})" stroke-width="5"/>`
    : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 96 96">
<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="${BRAND.gradFrom}"/><stop offset="1" stop-color="${BRAND.gradTo}"/>
</linearGradient></defs>
${container}
<path d="M37.1 32.4 A19 19 0 0 0 37.1 63.6" fill="none" stroke="${BRAND.waveInner}" stroke-width="4" stroke-linecap="round" opacity=".85"/>
<path d="M30 26.6 A28 28 0 0 0 30 69.4" fill="none" stroke="${BRAND.waveOuter}" stroke-width="4" stroke-linecap="round" opacity=".4"/>
<path d="M58.9 32.4 A19 19 0 0 1 58.9 63.6" fill="none" stroke="${BRAND.waveInner}" stroke-width="4" stroke-linecap="round" opacity=".85"/>
<path d="M66 26.6 A28 28 0 0 1 66 69.4" fill="none" stroke="${BRAND.waveOuter}" stroke-width="4" stroke-linecap="round" opacity=".4"/>
<path d="M42 58 L48 39 L54 58 M40.5 49.5 L55.5 49.5 M40.5 54.5 L55.5 54.5" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
}

export const logoDataUri = (size: number, opts?: { box?: boolean; id?: string }): string =>
  `data:image/svg+xml;utf8,${encodeURIComponent(logoSvg(size, opts))}`;
