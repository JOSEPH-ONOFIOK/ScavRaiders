import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "ScavRaiders — Founding Allowlist | The Scrap Nexus";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#04060d",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Cyan glow top-right */}
        <div
          style={{
            position: "absolute",
            right: -120,
            top: -120,
            width: 700,
            height: 700,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(87,208,240,0.18) 0%, rgba(87,208,240,0.04) 50%, transparent 70%)",
            display: "flex",
          }}
        />
        {/* Purple glow bottom-left */}
        <div
          style={{
            position: "absolute",
            left: -80,
            bottom: -80,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(157,107,255,0.14) 0%, transparent 70%)",
            display: "flex",
          }}
        />

        {/* Eyebrow */}
        <div
          style={{
            color: "#57d0f0",
            fontSize: 14,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            marginBottom: 28,
            fontFamily: "monospace",
            display: "flex",
          }}
        >
          FOUNDING COLLECTION · EXTRACTION SURVIVAL
        </div>

        {/* Brand */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "baseline",
            marginBottom: 24,
            lineHeight: 1,
          }}
        >
          <span
            style={{
              fontSize: 100,
              fontWeight: 700,
              color: "#eaf1fb",
              textTransform: "uppercase",
              letterSpacing: "-0.01em",
            }}
          >
            SCAV
          </span>
          <span
            style={{
              fontSize: 100,
              fontWeight: 700,
              color: "#57d0f0",
              textTransform: "uppercase",
              letterSpacing: "-0.01em",
            }}
          >
            RAIDERS
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 24,
            color: "#8b9bb6",
            marginBottom: 56,
            display: "flex",
          }}
        >
          Choose your home world. Awaken a faction. Reserve your Founding license.
        </div>

        {/* Divider */}
        <div
          style={{
            width: "100%",
            height: 1,
            background: "rgba(120,160,210,0.22)",
            marginBottom: 32,
            display: "flex",
          }}
        />

        {/* Stats row */}
        <div style={{ display: "flex", gap: 64 }}>
          {[
            ["2,500", "Founding Supply"],
            ["4", "Founding Worlds"],
            ["0%", "Holder Trade Fees"],
          ].map(([n, l]) => (
            <div key={l} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div
                style={{
                  color: "#eaf1fb",
                  fontSize: 34,
                  fontWeight: 700,
                  fontFamily: "monospace",
                }}
              >
                {n}
              </div>
              <div
                style={{
                  color: "#56657f",
                  fontSize: 11,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  fontFamily: "monospace",
                }}
              >
                {l}
              </div>
            </div>
          ))}
        </div>

        {/* Live badge */}
        <div
          style={{
            position: "absolute",
            bottom: 44,
            right: 64,
            color: "#36d97a",
            fontSize: 13,
            letterSpacing: "0.1em",
            fontFamily: "monospace",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          ● ALLOWLIST OPEN
        </div>
      </div>
    ),
    { ...size }
  );
}
