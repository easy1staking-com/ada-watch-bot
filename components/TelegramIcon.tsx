/** Official Telegram logo (brand gradient circle + paper plane). */
export default function TelegramIcon({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 240 240" aria-label="Telegram" style={{ display: "block" }}>
      <defs>
        <linearGradient id="tg-grad" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0" stopColor="#2AABEE" />
          <stop offset="1" stopColor="#229ED9" />
        </linearGradient>
      </defs>
      <circle cx="120" cy="120" r="120" fill="url(#tg-grad)" />
      <path
        fill="#fff"
        d="M81.4 118.8c34-14.8 56.7-24.6 68-29.3 32.4-13.5 39.1-15.8 43.5-15.9 1 0 3.1.2 4.5 1.3 1.2.9 1.5 2.1 1.6 3 .2.9.4 2.9.2 4.5-1.8 18.5-9.4 63.3-13.3 84-1.6 8.8-4.9 11.7-8 12-6.8.6-12-4.5-18.6-8.8-10.3-6.8-16.2-11-26.2-17.6-11.6-7.6-4.1-11.8 2.5-18.7 1.7-1.8 31.8-29.2 32.4-31.7.1-.3.1-1.5-.6-2.1-.7-.6-1.7-.4-2.5-.2-1 .2-17.5 11.1-49.4 32.7-4.7 3.2-8.9 4.8-12.7 4.7-4.2-.1-12.2-2.4-18.2-4.3-7.3-2.4-13.2-3.6-12.7-7.7.3-2.1 3.2-4.2 8.8-6.4z"
      />
    </svg>
  );
}
