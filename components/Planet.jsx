"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

// Build a Fibonacci-sphere cloud of points for a planet "made of many particles".
function useSphereCloud(count, radius) {
  return useMemo(() => {
    const positions = new Float32Array(count * 3);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2; // 1 -> -1
      const r = Math.sqrt(1 - y * y);
      const theta = golden * i;
      // jitter the radius slightly so it reads as terrain, not a perfect shell
      const rr = radius * (0.96 + Math.random() * 0.08);
      positions[i * 3] = Math.cos(theta) * r * rr;
      positions[i * 3 + 1] = y * rr;
      positions[i * 3 + 2] = Math.sin(theta) * r * rr;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [count, radius]);
}

// A soft radial sprite texture, generated once, used for the glow halo.
function useGlowTexture() {
  return useMemo(() => {
    const size = 128;
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const ctx = c.getContext("2d");
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.25, "rgba(255,255,255,0.55)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);
}

export default function Planet({ faction, selected, reducedMotion, onSelect }) {
  const group = useRef();
  const cloud = useRef();
  const [hovered, setHovered] = useState(false);
  const geo = useSphereCloud(360, faction.radius);
  const glowTex = useGlowTexture();

  const baseColor = useMemo(() => new THREE.Color(faction.color), [faction.color]);
  const glowColor = useMemo(() => new THREE.Color(faction.glow), [faction.glow]);

  const active = selected || hovered;

  useFrame((state, delta) => {
    if (cloud.current && !reducedMotion) {
      cloud.current.rotation.y += delta * faction.spin;
      cloud.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.15) * 0.12;
    }
    if (group.current) {
      // gentle float + scale toward target when active
      const target = selected ? 1.18 : hovered ? 1.08 : 1;
      group.current.scale.lerp(new THREE.Vector3(target, target, target), 0.12);
      if (!reducedMotion) {
        group.current.position.y =
          faction.pos[1] + Math.sin(state.clock.elapsedTime * 0.5 + faction.pos[0]) * 0.06;
      }
    }
  });

  return (
    <group ref={group} position={faction.pos}>
      {/* invisible, slightly larger hit sphere for easy hover/click */}
      <mesh
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(faction.id);
        }}
      >
        <sphereGeometry args={[faction.radius * 1.35, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* particle body */}
      <points ref={cloud} geometry={geo}>
        <pointsMaterial
          size={active ? 0.05 : 0.038}
          sizeAttenuation
          color={baseColor}
          transparent
          opacity={active ? 1 : 0.85}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* solid faint core so the planet reads as a body, not just dust */}
      <mesh>
        <sphereGeometry args={[faction.radius * 0.82, 24, 24]} />
        <meshBasicMaterial color={baseColor} transparent opacity={active ? 0.12 : 0.06} />
      </mesh>

      {/* glow halo */}
      <sprite scale={[faction.radius * 4.2, faction.radius * 4.2, 1]}>
        <spriteMaterial
          map={glowTex}
          color={glowColor}
          transparent
          opacity={active ? 0.5 : 0.28}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>

      {/* selection ring */}
      {selected && (
        <mesh rotation={[Math.PI / 2.2, 0, 0]}>
          <ringGeometry args={[faction.radius * 1.5, faction.radius * 1.58, 64]} />
          <meshBasicMaterial color={glowColor} transparent opacity={0.8} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* HTML label / accessible select button */}
      <Html position={[0, -faction.radius - 0.55, 0]} center distanceFactor={9} zIndexRange={[20, 0]}>
        <button
          className={`planet-label ${selected ? "is-selected" : ""}`}
          style={{ "--fac": faction.color }}
          onClick={() => onSelect(faction.id)}
          aria-pressed={selected}
        >
          <span className="planet-label__name">{faction.name}</span>
          <span className="planet-label__world">{faction.world}</span>
        </button>
      </Html>
    </group>
  );
}
