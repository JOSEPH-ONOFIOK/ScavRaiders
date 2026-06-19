// Single source of truth for the four founding factions.
// Used by the 3D galaxy, the console form, and the faction cards.

export const FACTIONS = [
  {
    id: "frost",
    name: "Frostborn",
    role: "Tactical Scout · Recon",
    world: "Hothar-IX",
    blurb:
      "Built to survive brutal environmental extremes and read a collapsing world before it turns on you.",
    trait: "+15% Storm-Dimension Vision",
    danger: "MODERATE",
    color: "#5fd6f5",
    glow: "#9fe9ff",
    // 3D placement: [x, y, z], radius, rotation speed
    pos: [-3.3, 1.5, -0.6],
    radius: 0.95,
    spin: 0.16,
  },
  {
    id: "shadow",
    name: "Shadowcat",
    role: "Infiltrator · Stealth",
    world: "Umbra Reach",
    blurb:
      "Ghost-like speed and high-tier looting bonuses. In and out before a rival crew knows you came.",
    trait: "+20% Rare-loot Detection",
    danger: "HIGH",
    color: "#9d6bff",
    glow: "#c4a6ff",
    pos: [-1.9, -1.9, 1.3],
    radius: 0.72,
    spin: 0.24,
  },
  {
    id: "talon",
    name: "Talon",
    role: "Marksman · Tracking",
    world: "Aerie Prime",
    blurb:
      "Long-range precision and target tracking. Hunts threats from the shadows before they close in.",
    trait: "+18% Mark & Track Range",
    danger: "MODERATE",
    color: "#e8c98a",
    glow: "#f6e4ba",
    pos: [3.5, 0.7, 0.4],
    radius: 1.15,
    spin: 0.12,
  },
  {
    id: "vulpine",
    name: "Vulpine",
    role: "Engineer · Crafting",
    world: "Cinder Hollow",
    blurb:
      "Resourceful fighter and negotiator who turns raw scrap into advanced gear faster than anyone.",
    trait: "Deconstructs scrap 20% faster",
    danger: "EXTREME",
    color: "#ff7a2e",
    glow: "#ffb27a",
    pos: [2.5, -1.7, -1.1],
    radius: 1.0,
    spin: 0.2,
  },
];

export const byId = (id) => FACTIONS.find((f) => f.id === id) || null;
