"use client";

import { useState, useEffect } from "react";
import { FACTIONS, byId } from "@/lib/factions";

// ── Update these before launch ───────────────────────────────────────────────
const X_HANDLE = "ScavRaiders";
// Replace YOUR_TWEET_ID with the actual announcement tweet ID once posted
const TWEET_URL = "https://x.com/ScavRaiders/status/YOUR_TWEET_ID";
const QUOTE_TEXT = `Joining @${X_HANDLE} Genesis — choosing my faction in the Scrap Nexus. Come raid with me 🛸\n\nTagging: @`;
// ────────────────────────────────────────────────────────────────────────────

const TASKS = [
  {
    id: "follow",
    label: `Follow @${X_HANDLE} on X`,
    href: `https://x.com/intent/follow?screen_name=${X_HANDLE}`,
    cta: "Follow →",
  },
  {
    id: "likeRT",
    label: "Like & retweet the announcement",
    href: TWEET_URL,
    cta: "Open tweet →",
  },
  {
    id: "quote",
    label: "Quote tweet & tag 2 friends",
    href: `https://x.com/intent/tweet?url=${encodeURIComponent(TWEET_URL)}&text=${encodeURIComponent(QUOTE_TEXT)}`,
    cta: "Quote tweet →",
  },
];

export default function Console({ selected, onSelect }) {
  const [email, setEmail] = useState("");
  const [social, setSocial] = useState("");
  const [agree, setAgree] = useState(false);
  const [tasksChecked, setTasksChecked] = useState({});
  const [proofLink, setProofLink] = useState("");
  const [wallet, setWallet] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(null);
  const [copied, setCopied] = useState(false);

  const fac = byId(selected);
  const accent = fac ? fac.color : "#57d0f0";

  useEffect(() => {
    document.documentElement.style.setProperty("--accent", accent);
  }, [accent]);

  const allTasksDone = TASKS.every((t) => tasksChecked[t.id]);
  const hasProof = proofLink.trim().startsWith("http");

  function checkTask(id) {
    setTasksChecked((prev) => ({ ...prev, [id]: true }));
  }

  function toggleTask(id) {
    setTasksChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function copyRef() {
    navigator.clipboard.writeText(confirmed.refLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

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
    if (!allTasksDone) {
      setError("⚠ Complete all three X tasks first.");
      return;
    }
    if (!hasProof) {
      setError("⚠ Paste your quote tweet link to verify.");
      return;
    }
    if (!wallet.trim()) {
      setError("⚠ Enter your EVM wallet address.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/allowlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          social: social.trim(),
          faction: selected,
          proofLink: proofLink.trim(),
          wallet: wallet.trim(),
        }),
      });
      const data = await res.json();
      if (!data.ok) {
        setError(`⚠ ${data.error}`);
        return;
      }
      const refLink = `${window.location.origin}/?ref=${data.raiderId}`;
      setConfirmed({ raiderId: data.raiderId, faction: selected, refLink });
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
    setTasksChecked({});
    setProofLink("");
    setWallet("");
    setError("");
    setCopied(false);
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
              {fac
                ? `SES://${fac.world.replace(/\s+/g, "-").toLowerCase()}`
                : "SES://no-world-locked"}
            </span>
          </div>

          {!confirmed ? (
            <div className="console-body">
              <div className="form-col">
                {/* ── World readout ── */}
                <div className="world-readout">
                  {fac ? (
                    <>
                      <span className="wr-dot" style={{ background: accent }} />
                      <span>
                        WORLD LOCKED — <b>{fac.world}</b> · {fac.name}
                      </span>
                    </>
                  ) : (
                    <span className="wr-empty">
                      No world locked. Select a planet in the Nexus above ↑
                    </span>
                  )}
                </div>

                {/* ── Email ── */}
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
                  <div className="hint">
                    Any provider works — just make sure you can receive mail there.
                  </div>
                </div>

                {/* ── Faction chips ── */}
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

                {/* ── Social handle ── */}
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
                  <div className="hint">
                    Helps us prioritize active community members.
                  </div>
                </div>

                {/* ── X Tasks ── */}
                <div className="tasks-head">
                  <span className="tasks-label">COMPLETE X TASKS</span>
                  <span className="tasks-count">
                    {Object.values(tasksChecked).filter(Boolean).length} / {TASKS.length}
                  </span>
                </div>
                <div className="task-list">
                  {TASKS.map((t) => (
                    <div
                      key={t.id}
                      className={`task-row ${tasksChecked[t.id] ? "done" : ""}`}
                    >
                      <button
                        type="button"
                        className="task-check"
                        aria-pressed={!!tasksChecked[t.id]}
                        onClick={() => toggleTask(t.id)}
                      >
                        {tasksChecked[t.id] ? "✓" : ""}
                      </button>
                      <span className="task-label">{t.label}</span>
                      <a
                        href={t.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="task-link"
                        onClick={() => {
                          if (!tasksChecked[t.id]) {
                            setTimeout(() => checkTask(t.id), 1500);
                          }
                        }}
                      >
                        {t.cta}
                      </a>
                    </div>
                  ))}
                </div>

                {/* ── Proof link (reveals after all tasks done) ── */}
                {allTasksDone && (
                  <div className="field field-reveal">
                    <label>
                      Quote tweet link <span className="req">*</span>
                    </label>
                    <input
                      type="url"
                      value={proofLink}
                      onChange={(e) => setProofLink(e.target.value)}
                      placeholder="https://x.com/yourhandle/status/..."
                    />
                    <div className="hint">
                      Paste the URL of your quote tweet tagging 2 friends.
                    </div>
                  </div>
                )}

                {/* ── Wallet (reveals after proof link is filled) ── */}
                {allTasksDone && hasProof && (
                  <div className="field field-reveal">
                    <label>
                      EVM wallet address <span className="req">*</span>
                    </label>
                    <input
                      type="text"
                      value={wallet}
                      onChange={(e) => setWallet(e.target.value)}
                      placeholder="0x..."
                      autoComplete="off"
                      spellCheck={false}
                    />
                    <div className="hint">
                      The wallet that will receive your Genesis license at mint.
                    </div>
                  </div>
                )}

                {/* ── Agree ── */}
                <label className="agree">
                  <input
                    type="checkbox"
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                  />
                  <span>
                    I understand a license is access to a game in development — not a
                    financial product or a promise of returns — and I want gameplay
                    updates.
                  </span>
                </label>

                <button
                  className="submit"
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting ? "Transmitting…" : "Reserve my slot →"}
                </button>
                <div className="err">{error}</div>
              </div>

              {/* ── Aside ── */}
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
            /* ── Confirmation ── */
            <div className="confirm on">
              <div className="ridlabel">REGISTRATION CONFIRMED · RAIDER ID</div>
              <div className="raiderid">{confirmed.raiderId}</div>
              <div className="confirm-big">
                {byId(confirmed.faction)?.name} · You&rsquo;re on the list
              </div>
              <p>
                Insertion point set to <b>{byId(confirmed.faction)?.world}</b>. Watch
                your inbox for the pre-alpha key and mint window. Welcome to the Nexus.
              </p>

              {/* ── Referral link ── */}
              <div className="ref-block">
                <div className="ref-label">YOUR REFERRAL LINK</div>
                <div className="ref-row">
                  <input
                    className="ref-input"
                    readOnly
                    value={confirmed.refLink}
                    onFocus={(e) => e.target.select()}
                  />
                  <button className="ref-copy" type="button" onClick={copyRef}>
                    {copied ? "Copied ✓" : "Copy"}
                  </button>
                </div>
                <div className="ref-hint">
                  Share this link — every friend who registers via it boosts your
                  priority in the mint queue.
                </div>
                <a
                  className="ref-x"
                  href={`https://x.com/intent/tweet?text=${encodeURIComponent(
                    `Just locked my Genesis slot in @${X_HANDLE} 🛸\n\nJoin me in the Scrap Nexus → ${confirmed.refLink}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Share on X →
                </a>
              </div>

              <button className="btn" onClick={reset} style={{ marginTop: 24 }}>
                Register another
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
