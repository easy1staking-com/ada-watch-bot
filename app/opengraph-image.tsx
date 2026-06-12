import { ImageResponse } from "next/og";
import { logoDataUri } from "@/lib/brand";

export const alt = "Ada Watch Bot — your Cardano wallet, in your pocket";
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
            "radial-gradient(900px 500px at 50% -10%, rgba(96,165,250,.55), rgba(42,123,228,.25) 40%, #0b1320 75%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            marginBottom: 28,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoDataUri(84)} width={84} height={84} alt="" />
          <div style={{ color: "#fff", fontSize: 56, fontWeight: 800 }}>Ada Watch</div>
        </div>
        <div style={{ color: "#fff", fontSize: 76, fontWeight: 800, textAlign: "center", lineHeight: 1.05 }}>
          Your wallet,
        </div>
        <div
          style={{
            fontSize: 76,
            fontWeight: 800,
            textAlign: "center",
            lineHeight: 1.05,
            background: "linear-gradient(180deg,#ffffff 30%, rgba(255,255,255,.35))",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          in your pocket.
        </div>
        <div style={{ color: "rgba(255,255,255,.55)", fontSize: 28, marginTop: 30 }}>
          Real-time Cardano notifications · Telegram &amp; Discord · non-custodial trading
        </div>
        <div style={{ color: "rgba(255,255,255,.35)", fontSize: 24, marginTop: 44 }}>
          adawatchbot.xyz
        </div>
      </div>
    ),
    size,
  );
}
