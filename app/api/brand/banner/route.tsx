import { ImageResponse } from "next/og";
import { logoDataUri } from "@/lib/brand";

/** X profile banner, 1500×500 PNG. */
export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 56,
          backgroundColor: "#0b1320",
          backgroundImage:
            "radial-gradient(1000px 420px at 50% -15%, rgba(96,165,250,.5), rgba(42,123,228,.22) 45%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoDataUri(280)} width={280} height={280} alt="" />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ color: "#fff", fontSize: 84, fontWeight: 800, lineHeight: 1 }}>Ada Watch</div>
          <div style={{ color: "rgba(255,255,255,.6)", fontSize: 34, marginTop: 18 }}>
            Your Cardano wallet, in your pocket.
          </div>
          <div style={{ color: "rgba(255,255,255,.4)", fontSize: 26, marginTop: 16 }}>
            Real-time notifications · Telegram &amp; Discord · 🍨 non-custodial trading
          </div>
          <div style={{ color: "rgba(95,185,238,.9)", fontSize: 26, marginTop: 16 }}>
            adawatchbot.xyz · @AdaWatchBot
          </div>
        </div>
      </div>
    ),
    { width: 1500, height: 500 },
  );
}
