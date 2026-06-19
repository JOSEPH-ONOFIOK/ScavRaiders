"use client";

import { useState } from "react";
import Image from "next/image";
import { FACTIONS } from "@/lib/factions";

export function StatusBar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="statusbar">
      <div className="wrap">
        <div className="brand">
          <span className="dot" />
          SCAV<b>RAIDERS</b>
        </div>
        <span className="sbtag">
          <span className="live">●</span> ALLOWLIST OPEN
        </span>
        <span className="sbtag dim">FOUNDING · 2,500 LICENSES · PHASE 01</span>
        <nav className={open ? "open" : ""}>
          <a href="#join" onClick={() => setOpen(false)}>Allowlist</a>
          <a href="#factions" onClick={() => setOpen(false)}>Factions</a>
          <a href="#meta" onClick={() => setOpen(false)}>Metadata</a>
          <a href="#perks" onClick={() => setOpen(false)}>Perks</a>
          <a href="#roadmap" onClick={() => setOpen(false)}>Roadmap</a>
        </nav>
        <button
          className="nav-toggle"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span /><span /><span />
        </button>
      </div>
    </header>
  );
}

export function Factions() {
  return (
    <section id="factions" className="section">
      <div className="wrap">
        <div className="sec-head">
          <span className="sec-num">02 /</span>
          <h2 className="sec-title">The Four Founding Factions</h2>
          <span className="sec-sub">// every Founding mint awakens one</span>
        </div>

        <div className="crew-band">
          <Image
            src="/crew.png"
            alt="The four founding ScavRaider factions"
            width={760}
            height={424}
            priority={false}
          />
        </div>

        <div className="fac-grid">
          {FACTIONS.map((f) => (
            <div className="fcard" key={f.id} style={{ "--fc": f.color }}>
              <div className="role">{f.role}</div>
              <h3>{f.name}</h3>
              <div className="world-tag">HOME WORLD · {f.world}</div>
              <div className="sub">{f.blurb}</div>
              <div className="trait">
                <span>SAMPLE TRAIT ›</span> {f.trait}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const PERKS = [
  ["P.01", "Founding Licenses", "Own a fully playable founding character from Day One, tradable on native platforms with 0% fees."],
  ["P.02", "Alpha Access", "Immediate entry to closed pre-alpha and every core playtest as the game is built around you."],
  ["P.03", "Governance", "Vote on sector drops, weapon balance and lore expansions. Holders steer where the Nexus grows."],
  ["P.04", "Exclusive Cosmetics", "Genesis-only skins and crew customization that can't be earned or minted after the drop closes."],
  ["P.05", "Guaranteed Drops", "Automatic whitelist allocation for future weapon, gear and base-land mints down the line."],
  ["P.06", "Provenance", "Carry verifiable proof you raided the earliest seasons — history that compounds over time."],
];

export function Perks() {
  return (
    <section id="perks" className="section">
      <div className="wrap">
        <div className="sec-head">
          <span className="sec-num">04 /</span>
          <h2 className="sec-title">Holder Perks</h2>
          <span className="sec-sub">// ownership, not advantage</span>
        </div>
        <div className="perks">
          {PERKS.map(([n, h, p]) => (
            <div className="perk" key={n}>
              <div className="pn">{n}</div>
              <h4>{h}</h4>
              <p>{p}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const PHASES = [
  ["● PHASE 01 — NOW", "Allowlist", "Build the founding crew. 2,500-slot Founding list opens; community forms.", true],
  ["PHASE 02", "Closed Pre-Alpha", "Allowlist plays the raid loop. Feedback drives balance before any mint.", false],
  ["PHASE 03", "Founding Mint", "Licenses go live to the list first, then public. Dynamic metadata switches on.", false],
  ["PHASE 04", "F2P Launch", "Free starter characters open the Nexus to everyone. The economy goes live.", false],
];

export function Roadmap() {
  return (
    <section id="roadmap" className="section">
      <div className="wrap">
        <div className="sec-head">
          <span className="sec-num">05 /</span>
          <h2 className="sec-title">The Drop Sequence</h2>
          <span className="sec-sub">// fun first, always</span>
        </div>
        <div className="phases">
          {PHASES.map(([pp, h, p, now]) => (
            <div className={`phase ${now ? "now" : ""}`} key={h}>
              <div className="pp">{pp}</div>
              <h4>{h}</h4>
              <p>{p}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="philo">
          Play because it&rsquo;s <b>fun</b>. Own because it <i>matters</i>. Trade because you <b>choose</b> to.
        </div>
        <div className="philo-sub">— THE SCAVRAIDERS PHILOSOPHY —</div>
        <div className="fsocial">
          {/* Replace # with your actual URLs before launch */}
          <a href="https://x.com/scavraiders" target="_blank" rel="noopener noreferrer" aria-label="X / Twitter">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.261 5.632 5.903-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
          <a href="https://discord.gg/scavraiders" target="_blank" rel="noopener noreferrer" aria-label="Discord">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.04.03.052a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
          </a>
        </div>
        <div className="fbottom">
          <span>© 2026 SCAVRAIDERS · THE SCRAP NEXUS</span>
          <div className="links">
            <a href="#join">Allowlist</a>
            <a href="#factions">Factions</a>
            <a href="#roadmap">Roadmap</a>
          </div>
        </div>
        <p className="disclaimer">
          A ScavRaider license is access to a video game in active development and the cosmetic/ownership
          features described above. It is not an investment, security, or a promise of profit, and nothing
          here is financial advice. Roadmap, supply, perks and timing may change. Free starter characters keep
          the game fully playable without owning anything — no pay-to-win.
        </p>
      </div>
    </footer>
  );
}
