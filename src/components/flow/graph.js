// Shared geometry and helpers for every commit graph in the book, so all
// branching flows render with one identical visual language.

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
