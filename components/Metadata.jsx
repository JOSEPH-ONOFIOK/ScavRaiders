"use client";

import { useEffect, useRef, useState } from "react";

const ROWS = [
  { k: "Raids completed", target: 412 },
  { k: "Nexus kills", target: 158 },
  { k: "Worlds discovered", target: 27 },
  { k: "Legendary scrap", target: 9 },
  { k: "Reputation", text: "ELITE" },
];

function Counter({ row, run }) {
  const [val, setVal] = useState(row.text ? "—" : 0);
  const [bumped, setBumped] = useState(false);

  useEffect(() => {
    if (!run) return;
    if (row.text) {
      const t = setTimeout(() => {
        setVal(row.text);
        setBumped(true);
      }, 700);
      return () => clearTimeout(t);
    }
    let raf;
    const dur = 1300;
    const start = performance.now();
    const tick = (now) => {
      const k = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - k, 3);
      setVal(Math.round(row.target * eased));
      if (k < 1) raf = requestAnimationFrame(tick);
      else setBumped(true);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, row]);

  return (
    <div className="mrow">
      <span className="k">{row.k}</span>
      <span className={`v ${bumped ? "up" : ""}`}>
        {typeof val === "number" ? val.toLocaleString() : val}
      </span>
    </div>
  );
}

export default function Metadata() {
  const ref = useRef();
  const [run, setRun] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setRun(true)),
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="meta" className="section">
      <div className="wrap">
        <div className="sec-head">
          <span className="sec-num">03 /</span>
          <h2 className="sec-title">An NFT That Earns Its Scars</h2>
          <span className="sec-sub">// metadata that evolves with play</span>
        </div>
        <div className="meta">
          <div className="meta-copy">
            <div className="tag">Dynamic on-chain identity</div>
            <p>
              A Genesis license isn&rsquo;t a static picture. Every milestone you reach in a raid is written
              into your token&rsquo;s history. A veteran Shadowcat with 300+ extractions reads differently than
              a fresh mint — the story is baked into the asset, not bolted on.
            </p>
            <p style={{ marginTop: 14 }}>
              It&rsquo;s a digital trophy. Provable effort, provable presence at the moments that mattered.
            </p>
          </div>
          <div className="trophy" ref={ref}>
            <div className="trophy-top">
              SR-2381 · FROSTBORN
              <span className="chain">
                <span className="cdot" /> ON-CHAIN
              </span>
            </div>
            {ROWS.map((r) => (
              <Counter key={r.k} row={r} run={run} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
