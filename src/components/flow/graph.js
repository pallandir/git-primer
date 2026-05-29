// Shared geometry and helpers for every commit graph in the book, so all
// branching flows render with one identical visual language.

// Secondary palette, mirrored as CSS custom properties in custom.css. These are
// the exact hues already used across the demos; centralising them keeps any
// JS-driven animation (anime.js fills, packet tints) in step with the CSS.
export const COLORS = {
  main: "#f05133",
  feature: "#4aa3ff",
  alt: "#b07cff",
  pick: "#ff5fa2",
  green: "#7ee2a8",
  stash: "#6b4bb0",
  rehash: "#ff5a3c",
};

// One motion vocabulary. Durations are milliseconds; EASE values are anime.js
// easing labels (the JS-driven flights). CSS-side motion reads --gp-ease-move /
// --gp-dur-move from custom.css so the two stay aligned.
export const DUR = {
  caption: 240,
  pop: 440,
  pill: 360,
  move: 600,
  packet: 650,
  draw: 420,
  card: 260,
  rehash: 850,
};

export const EASE = {
  packet: "inOutQuad",
  draw: "inOutSine",
  pop: "outBack",
};

export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

// The shared reactive bus for SvelteFlow demos: zone cards + edge packet firing.
// Owners create one of these, embed it in every node/edge `data`, then bump
// fire[i] to launch the packet on edge i. See ZoneNode / PacketEdge.
export function createVis(zoneCount, edgeCount) {
  return {
    zones: Array.from({ length: zoneCount }, () => ({ active: false, card: null })),
    activeEdge: null,
    fire: Array.from({ length: edgeCount }, () => 0),
    fireDir: "forward",
    edgeLabels: Array.from({ length: edgeCount }, () => null),
  };
}

export const R = 18;
export const COL_W = 92;
export const X0 = 46;

export const LANES = {
  main: 96,
  feature: 178,
  single: 132,
};

export const colX = (col) => X0 + col * COL_W;
export const laneY = (lane) => (typeof lane === "number" ? lane : (LANES[lane] ?? LANES.main));

export function edgePath(a, b) {
  if (a.y === b.y) return `M${a.x} ${a.y} L${b.x} ${b.y}`;
  const mx = (a.x + b.x) / 2;
  return `M${a.x} ${a.y} C ${mx} ${a.y}, ${mx} ${b.y}, ${b.x} ${b.y}`;
}

export const pillW = (label) => Math.max(46, label.length * 7.6 + 18);

// Assign a vertical stack level to pointers that share a commit, in input
// order (so a trailing HEAD sits on top of the branch pills it rides with).
export function stackLevels(pointers) {
  const seen = {};
  return pointers.map((p) => {
    const lvl = seen[p.at] ?? 0;
    seen[p.at] = lvl + 1;
    return { ...p, level: lvl };
  });
}
