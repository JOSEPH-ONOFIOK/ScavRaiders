"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { StatusBar, Factions, Perks, Roadmap, Footer } from "@/components/Sections";
import Console from "@/components/Console";
import Metadata from "@/components/Metadata";
import { byId } from "@/lib/factions";

// 3D galaxy is client-only (WebGL) — never server-rendered.
const Galaxy = dynamic(() => import("@/components/Galaxy"), {
  ssr: false,
  loading: () => <div className="galaxy-loading">Booting the Scrap Nexus…</div>,
});

export default function Page() {
  const [selected, setSelected] = useState(null);
  const [spots, setSpots] = useState(null);
  const fac = byId(selected);

  useEffect(() => {
    fetch("/api/spots")
      .then((r) => r.json())
      .then((d) => { if (d.remaining !== null) setSpots(d.remaining); })
      .catch(() => {});
  }, []);

  function handleSelect(id) {
    setSelected(id);
    // glide down to the registration console after locking a world
    const el = document.getElementById("join");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      <StatusBar />

      {/* HERO — the galaxy world-select */}
      <div className="galaxy-hero">
        <div className="galaxy-canvas">
          <Galaxy selected={selected} onSelect={(id) => setSelected(id)} />
        </div>

        <div className="hero-overlay">
          <div className="eyebrow">GENESIS COLLECTION · EXTRACTION SURVIVAL</div>
          <h1>
            Choose Your
            <br />
            <span className="nx">Home World</span>
          </h1>
          <p className="lede">
            Four founding worlds drift in the Scrap Nexus. Select a planet to awaken its faction and open
            your Genesis registration. Dive. Loot. Extract.
          </p>
          <div className="hero-status">
            {fac ? (
              <span style={{ color: fac.color }}>
                ◉ {fac.world} locked — <b>{fac.name}</b>
              </span>
            ) : (
              <span className="muted">◌ Select a world to begin · drag to orbit the Nexus</span>
            )}
          </div>
          <a href="#join" className="btn btn-primary" onClick={() => fac || null}>
            {fac ? "Continue to registration ↓" : "Skip to allowlist ↓"}
          </a>
        </div>

        <div className="spots">
          <div className="spot">
            <div className="n">2,500</div>
            <div className="l">Genesis supply</div>
          </div>
          <div className="spot">
            <div className="n warm">{spots !== null ? spots.toLocaleString() : "1,914"}</div>
            <div className="l">Spots remaining</div>
          </div>
          <div className="spot">
            <div className="n">4</div>
            <div className="l">Founding worlds</div>
          </div>
          <div className="spot">
            <div className="n">0%</div>
            <div className="l">Holder trade fees</div>
          </div>
        </div>
      </div>

      <Console selected={selected} onSelect={handleSelect} />
      <Factions />
      <Metadata />
      <Perks />
      <Roadmap />
      <Footer />
    </>
  );
}
