"use client";
import Link from "next/link";
import { StatusBar, Footer } from "@/components/Sections";
import Starfield from "@/components/Starfield";

export default function PageShell({ title, sub, children }) {
  return (
    <>
      <StatusBar />
      <Starfield />
      <div className="page-enter">
        <div className="inner-hero">
          <div className="wrap">
            <span className="inner-eyebrow">// SCAVRAIDERS · NEXUS</span>
            <h1 className="inner-title">{title}</h1>
            {sub && <p className="inner-sub">{sub}</p>}
          </div>
        </div>
        {children}
      </div>
      <Link href="/" className="back-home">↖ NEXUS HOME</Link>
      <Footer />
    </>
  );
}
