import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Keep Ada Watch free — delegate to EASY1";
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
          background:
            "radial-gradient(900px 500px at 50% -10%, rgba(52,211,153,.30), rgba(42,123,228,.22) 45%, #0b1320 78%), #0b1320",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 84, marginBottom: 10 }}>🤝</div>
        <div style={{ color: "#fff", fontSize: 70, fontWeight: 800, textAlign: "center", lineHeight: 1.08 }}>
          Keep Ada Watch
        </div>
        <div
          style={{
            fontSize: 70,
            fontWeight: 800,
            background: "linear-gradient(180deg,#ffffff 30%, rgba(255,255,255,.35))",
            backgroundClip: "text",
            color: "transparent",
            lineHeight: 1.08,
          }}
        >
          free for everyone
        </div>
        <div style={{ color: "rgba(255,255,255,.55)", fontSize: 28, marginTop: 28 }}>
          Delegate to EASY1 — same rewards, more watching
        </div>
        <div style={{ color: "rgba(255,255,255,.35)", fontSize: 24, marginTop: 40 }}>
          adawatchbot.xyz/delegate
        </div>
      </div>
    ),
    size,
  );
}
