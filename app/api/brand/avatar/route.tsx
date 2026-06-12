import { ImageResponse } from "next/og";
import { logoDataUri } from "@/lib/brand";

/** X / social profile picture: the mark full-bleed on brand navy, 400×400 PNG. */
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
          backgroundColor: "#0b1320",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoDataUri(340)} width={340} height={340} alt="" />
      </div>
    ),
    { width: 400, height: 400 },
  );
}
