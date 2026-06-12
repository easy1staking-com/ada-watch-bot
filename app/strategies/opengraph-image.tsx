import { ImageResponse } from "next/og";

export const alt = "SundaeSwap strategies on Ada Watch — deposit once, buy with one tap";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#0b1320",
          backgroundImage:
            "radial-gradient(900px 500px at 50% -10%, rgba(240,112,208,.35), rgba(92,52,223,.25) 45%, #0b1320 78%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 84, marginBottom: 10 }}>🍨</div>
        <div style={{ color: "#fff", fontSize: 72, fontWeight: 800, textAlign: "center", lineHeight: 1.08 }}>
          Deposit once.
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            background: "linear-gradient(90deg,#F070D0,#a78bfa)",
            backgroundClip: "text",
            color: "transparent",
            lineHeight: 1.08,
          }}
        >
          Buy with one tap.
        </div>
        <div style={{ color: "rgba(255,255,255,.55)", fontSize: 28, marginTop: 28, textAlign: "center" }}>
          Non-custodial trading vaults on SundaeSwap v3 — from Telegram
        </div>
        <div style={{ color: "rgba(255,255,255,.35)", fontSize: 24, marginTop: 40 }}>
          adawatchbot.xyz/strategies · 👁 Ada Watch × 🍨 SundaeSwap
        </div>
      </div>
    ),
    size,
  );
}
