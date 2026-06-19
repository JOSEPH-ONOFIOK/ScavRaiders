"use client";

import { useMemo, useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { FACTIONS } from "@/lib/factions";
import Planet from "./Planet";

// Soft radial sprite texture so glows read as circles, not square quads.
function makeGlowTexture() {
  const size = 128;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d");
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.3, "rgba(255,255,255,0.5)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function NexusCore({ reducedMotion }) {
  const ref = useRef();
  const glow = useMemo(() => makeGlowTexture(), []);
  useFrame((state, delta) => {
    if (ref.current && !reducedMotion) {
      ref.current.rotation.y += delta * 0.4;
      const s = 1 + Math.sin(state.clock.elapsedTime * 1.4) * 0.04;
      ref.current.scale.setScalar(s);
    }
  });
  return (
    <group>
      <mesh ref={ref}>
        <icosahedronGeometry args={[0.55, 1]} />
        <meshBasicMaterial color="#bfefff" wireframe transparent opacity={0.7} />
      </mesh>
      <pointLight color="#7fe3ff" intensity={6} distance={14} />
      <sprite scale={[6, 6, 1]}>
        <spriteMaterial
          map={glow}
          color="#5fd6f5"
          transparent
          opacity={0.5}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>
    </group>
  );
}

// Faint drifting dust for depth.
function Dust({ reducedMotion }) {
  const ref = useRef();
  const geo = useMemo(() => {
    const n = 400;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 22;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 14;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);
  useFrame((_, delta) => {
    if (ref.current && !reducedMotion) ref.current.rotation.y += delta * 0.01;
  });
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial size={0.02} color="#6fa8c8" transparent opacity={0.4} depthWrite={false} />
    </points>
  );
}

export default function Galaxy({ selected, onSelect }) {
  const [reducedMotion, setReducedMotion] = useState(false);
  // Galaxy is client-only (ssr:false), so window exists here.
  // Camera must be correct on first render — R3F reads it once at mount.
  const [camera] = useState(() => {
    const w = typeof window !== "undefined" ? window.innerWidth : 1200;
    if (w < 560) return { position: [0, 0.3, 13], fov: 58 };
    if (w < 900) return { position: [0, 0.4, 11], fov: 55 };
    return { position: [0, 0.4, 9.2], fov: 52 };
  });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const h = (e) => setReducedMotion(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  return (
    <Canvas
      camera={camera}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      onPointerMissed={() => {}}
    >
      <color attach="background" args={["#04060d"]} />
      <fog attach="fog" args={["#04060d", 9, 20]} />
      <ambientLight intensity={0.4} />

      <Stars radius={60} depth={40} count={2200} factor={3.2} saturation={0} fade speed={0.6} />
      <Dust reducedMotion={reducedMotion} />
      <NexusCore reducedMotion={reducedMotion} />

      {FACTIONS.map((f) => (
        <Planet
          key={f.id}
          faction={f}
          selected={selected === f.id}
          reducedMotion={reducedMotion}
          onSelect={onSelect}
        />
      ))}

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={!reducedMotion}
        autoRotateSpeed={0.28}
        minPolarAngle={Math.PI / 2.6}
        maxPolarAngle={Math.PI / 1.7}
        rotateSpeed={0.5}
      />
    </Canvas>
  );
}
