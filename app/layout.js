import "./globals.css";
import ScrollToTop from "@/components/ScrollToTop";

export const metadata = {
  title: "ScavRaiders — Founding Allowlist | The Scrap Nexus",
  description:
    "Choose your home world in the Scrap Nexus and reserve a Founding ScavRaider license. A playable, evolving extraction-survival character you truly own. Allowlist open.",
  openGraph: {
    title: "ScavRaiders — Founding Allowlist",
    description: "Select a world. Awaken a faction. Reserve your Founding license.",
    type: "website",
  },
};

export const viewport = {
  themeColor: "#04060d",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Fonts load in the browser at runtime — no build-time fetch required. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body><ScrollToTop />{children}</body>
    </html>
  );
}
