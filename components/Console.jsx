"use client";

import { useState, useEffect } from "react";
import { FACTIONS, byId } from "@/lib/factions";

export default function Console({ selected, onSelect }) {
  const [email, setEmail] = useState("");
  const [social, setSocial] = useState("");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(null); // { raiderId, faction }

  const fac = byId(selected);
  const accent = fac ? fac.color : "#57d0f0";

  useEffect(() => {
    document.documentElement.style.setProperty("--accent", accent);
  }, [accent]);

  async function handleSubmit() {
    setError("");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) {
      setError("⚠ Enter a valid email address.");
      return;
    }
    if (!selected) {
      setError("⚠ Choose a home world above to set your faction.");
      return;
    }
    if (!agree) {
      setError("⚠ Please confirm the checkbox to continue.");
      return;
    }

    setSubmitting(true);
    const payload = { email: email.trim(), social: social.trim(), faction: selected };
    try {
      const res = await fetch("/api/allowlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.ok) {
        setError(`⚠ ${data.error}`);
        return;
      }
      setConfirmed({ raiderId: data.raiderId, faction: selected });
    } catch {
      setError("⚠ Registration relay failed. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    setConfirmed(null);
    setEmail("");
    setSocial("");
    setAgree(false);
    setError("");
  }

  return (
    <section id="join" className="section">
      <div className="wrap">
        <div className="sec-head">
          <span className="sec-num">01 /</span>
          <h2 className="sec-title">Insertion Console</h2>
          <span className="sec-sub">// reserve your Genesis slot</span>
        </div>

        <div className="console" style={{ "--accent": accent }}>
          <div className="console-top">
            <span className="led" /> ALLOWLIST REGISTRATION
            <span className="seq">
              {fac ? `SES://${fac.world.replace(/\s+/g, "-").toLowerCase()}` : "SES://no-world-locked"}
            </span>
          </div>

          {!confirmed ? (
            <div className="console-body">
              <div className="form-col">
                <div className="world-readout">
                  {fac ? (
                    <>
                      <span className="wr-dot" style={{ background: accent }} />
                      <span>
                        WORLD LOCKED — <b>{fac.world}</b> · {fac.name}
                      </span>
                    </>
                  ) : (
                    <span className="wr-empty">No world locked. Select a planet in the Nexus above ↑</span>
                  )}
                </div>

                <div className="field">
                  <label>
                    Email <span className="req">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@gmail.com"
                    autoComplete="email"
                  />
                  <div className="hint">Any provider works — just make sure you can receive mail there.</div>
                </div>

                <span className="fac-label">Faction (set by world)</span>
                <div className="fac-mini">
                  {FACTIONS.map((f) => (
                    <button
                      key={f.id}
                      className={`mini-chip ${selected === f.id ? "sel" : ""}`}
                      style={{ "--fac": f.color }}
                      onClick={() => onSelect(f.id)}
                      type="button"
                    >
                      <span className="sw" style={{ background: f.color }} />
                      {f.name}
                    </button>
                  ))}
                </div>

                <div className="field">
                  <label>
                    X or Discord handle <span className="opt">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={social}
                    onChange={(e) => setSocial(e.target.value)}
                    placeholder="@yourhandle"
                  />
                  <div className="hint">Helps us prioritize active community members.</div>
                </div>

                <label className="agree">
                  <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
                  <span>
                    I understand a license is access to a game in development — not a financial product or a
                    promise of returns — and I want gameplay updates.
                  </span>
                </label>

                <button className="submit" onClick={handleSubmit} disabled={submitting}>
                  {submitting ? "Transmitting…" : "Reserve my slot →"}
                </button>
                <div className="err">{error}</div>
              </div>

              <div className="aside-col">
                <h3 className="aside-h">What the allowlist gets you</h3>
                {[
                  ["Guaranteed mint window", "before the public, with a held supply for the list."],
                  ["Closed pre-alpha access", "— play the raid loop before anyone, shape the build."],
                  ["No gas race.", "Allowlist mints in a calm window, not a public free-for-all."],
                  ["Free starter character", "regardless — the allowlist is access, never pay-to-win."],
                  ["Zero financial promise.", "You're here for the game first. Ownership second."],
                ].map(([b, t], i) => (
                  <div className="aline" key={i}>
                    <span className="ic">›</span>
                    <span>
                      <b>{b}</b> {t}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="confirm on">
              <div className="ridlabel">REGISTRATION CONFIRMED · RAIDER ID</div>
              <div className="raiderid">{confirmed.raiderId}</div>
              <div className="confirm-big">
                {byId(confirmed.faction)?.name} · You&rsquo;re on the list
              </div>
              <p>
                Insertion point set to <b>{byId(confirmed.faction)?.world}</b>. Watch your inbox for the
                pre-alpha key and mint window. Welcome to the Nexus.
              </p>
              <button className="btn" onClick={reset}>
                Register another
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
