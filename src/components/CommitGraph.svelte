<script>
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { backOut } from "svelte/easing";
  import { R, edgePath, pillW, DUR, prefersReducedMotion } from "./flow/graph.js";

  let {
    nodes = [],
    edges = [],
    pointers = [],
    width = 540,
    height = 230,
    label = "Git commit graph",
  } = $props();

  // Live positions per node id, mutated frame-by-frame by anime.js. Edges and
  // pointers read from here, so a connector bends and follows its commit as it
  // glides between lanes instead of snapping to the new endpoint.
  const pos = new Map();
  const tweens = new Map();
  let frame = $state(0);
  let animate = null;
  let easeMove = null;
  let animeReady = $state(false);

  onMount(() => {
    let alive = true;
    import("animejs").then((m) => {
      if (!alive) return;
      animate = m.animate;
      easeMove = m.cubicBezier(0.34, 1.18, 0.64, 1);
      animeReady = true;
    });
    return () => {
      alive = false;
      for (const t of tweens.values()) t.pause();
    };
  });

  function tweenTo(p, x, y) {
    tweens.get(p.__id)?.pause();
    const t = animate(p, {
      x,
      y,
      duration: DUR.move,
      ease: easeMove,
      onUpdate: () => frame++,
      onComplete: () => frame++,
    });
    return t;
  }

  $effect(() => {
    const reduced = prefersReducedMotion();
    for (const n of nodes) {
      const p = pos.get(n.id);
      if (!p) {
        // A node carrying `enterFrom` flies in from that point (e.g. a
        // cherry-picked commit gliding up from its branch onto main).
        if (n.enterFrom && animeReady && !reduced) {
          const start = { __id: n.id, x: n.enterFrom.x, y: n.enterFrom.y };
          pos.set(n.id, start);
          tweens.set(n.id, tweenTo(start, n.x, n.y));
        } else {
          pos.set(n.id, { __id: n.id, x: n.x, y: n.y });
        }
        continue;
      }
      if (p.x === n.x && p.y === n.y) continue;
      if (reduced || !animeReady) {
        p.x = n.x;
        p.y = n.y;
        frame++;
        continue;
      }
      tweens.set(n.id, tweenTo(p, n.x, n.y));
    }
    for (const id of [...pos.keys()]) {
      if (!nodes.some((n) => n.id === id)) {
        tweens.get(id)?.pause();
        tweens.delete(id);
        pos.delete(id);
      }
    }
  });

  const live = (id, fx, fy) => pos.get(id) ?? { x: fx, y: fy };

  let view = $derived.by(() => {
    frame; // recompute on every animation frame while a tween runs
    const map = {};
    for (const n of nodes) map[n.id] = live(n.id, n.x, n.y);
    return {
      nodes: nodes.map((n) => ({ ...n, _x: map[n.id].x, _y: map[n.id].y })),
      edges: edges
        .filter((e) => map[e.from] && map[e.to])
        .map((e) => ({ ...e, _d: edgePath(map[e.from], map[e.to]) })),
      pointers: pointers
        .map((p) => {
          const a = map[p.at];
          if (!a) return null;
          return {
            ...p,
            _x: a.x,
            _y: a.y - R - 16 - (p.level ?? 0) * 25,
            _w: pillW(p.label),
          };
        })
        .filter(Boolean),
    };
  });

  function pop(_node, { d = DUR.pop } = {}) {
    return {
      duration: d,
      css: (t) => {
        const e = backOut(t);
        return `opacity:${t};transform:scale(${0.3 + 0.7 * e})`;
      },
    };
  }

  function draw(node, { duration = DUR.draw } = {}) {
    let len = 0;
    try {
      len = node.getTotalLength();
    } catch {
      len = 0;
    }
    return {
      duration,
      css: (t) =>
        `opacity:${t};stroke-dasharray:${len};stroke-dashoffset:${len * (1 - t)}`,
    };
  }
</script>

<svg viewBox={`0 0 ${width} ${height}`} class="cg" role="img" aria-label={label}>
  {#each view.edges as e (e.id)}
    {#if e.ghost}
      <path
        d={e._d}
        class={`cg__edge cg__edge--${e.variant ?? "main"} cg__edge--ghost`}
        fill="none"
        in:fade={{ duration: 320 }}
        out:fade={{ duration: 200 }}
      />
    {:else}
      <path
        d={e._d}
        class={`cg__edge cg__edge--${e.variant ?? "main"}`}
        fill="none"
        in:draw
        out:fade={{ duration: 200 }}
      />
    {/if}
  {/each}

  {#each view.nodes as n (n.id)}
    <g class="cg__node" style={`transform:translate(${n._x}px,${n._y}px)`}>
      <g in:pop>
        <circle
          r={R}
          class={`cg__dot cg__dot--${n.variant ?? "main"}`}
          class:cg__dot--ghost={n.ghost}
          data-node={n.id}
        />
        <text class="cg__ctext" class:cg__ctext--ghost={n.ghost}>{n.label ?? n.id}</text>
      </g>
    </g>
  {/each}

  {#each view.pointers as p (p.key)}
    <g
      class={`cg__ptr cg__ptr--${p.variant ?? "branch"}`}
      class:cg__ptr--detached={p.detached}
      style={`transform:translate(${p._x}px,${p._y}px)`}
    >
      <g in:pop={{ d: DUR.pill }}>
        <rect x={-p._w / 2} y="-13" width={p._w} height="22" rx="6" class="cg__pill" />
        <text class="cg__ptext">{p.label}</text>
        <path d="M0 9 L-5 16 L5 16 Z" class="cg__tip" />
      </g>
    </g>
  {/each}
</svg>

<style>
  .cg {
    width: 100%;
    height: auto;
    overflow: visible;
    display: block;
  }

  .cg__edge {
    stroke-width: 3.5;
    stroke-linecap: round;
    transition: stroke 0.35s ease;
  }
  .cg__edge--main {
    stroke: var(--git-orange);
  }
  .cg__edge--feature {
    stroke: var(--gp-feature);
  }
  .cg__edge--alt {
    stroke: var(--gp-alt);
  }
  .cg__edge--pick {
    stroke: var(--gp-pick);
  }
  .cg__edge--ghost {
    stroke: var(--sl-color-gray-5);
    stroke-dasharray: 5 4;
    opacity: 0.55;
  }

  /* Position is driven frame-by-frame from JS (see the anime.js tween above),
     so there is no CSS transform transition here, which would otherwise fight
     the per-frame updates and add lag. */
  .cg__dot {
    stroke-width: 2.5;
    transition:
      fill 0.4s ease,
      stroke 0.4s ease,
      opacity 0.4s ease;
  }
  .cg__dot--main {
    fill: var(--git-orange);
    stroke: color-mix(in srgb, var(--git-orange) 45%, #000);
  }
  .cg__dot--feature {
    fill: var(--gp-feature);
    stroke: var(--gp-feature-stroke);
  }
  .cg__dot--alt {
    fill: var(--gp-alt);
    stroke: var(--gp-alt-stroke);
  }
  .cg__dot--pick {
    fill: var(--gp-pick);
    stroke: var(--gp-pick-stroke);
  }
  .cg__dot--merge {
    fill: var(--sl-color-gray-6);
    stroke: var(--git-orange);
  }
  .cg__dot--ghost {
    fill: var(--sl-color-gray-6);
    stroke: var(--sl-color-gray-4);
    stroke-dasharray: 4 3;
    opacity: 0.4;
  }
  .cg__ctext {
    font-size: 12.5px;
    font-weight: 700;
    fill: #fff;
    text-anchor: middle;
    dominant-baseline: middle;
    font-family: var(--__sl-font-mono, monospace);
    pointer-events: none;
  }
  .cg__ctext--ghost {
    fill: var(--sl-color-gray-3);
  }

  .cg__pill {
    fill: var(--sl-color-gray-6);
    stroke-width: 1.6;
  }
  .cg__ptext {
    font-size: 11px;
    font-weight: 700;
    fill: var(--sl-color-white);
    text-anchor: middle;
    dominant-baseline: middle;
    font-family: var(--__sl-font-mono, monospace);
    pointer-events: none;
  }
  .cg__ptr--branch .cg__pill,
  .cg__ptr--branch .cg__tip {
    stroke: var(--git-orange);
    fill: var(--sl-color-gray-6);
  }
  .cg__ptr--branch .cg__tip {
    fill: var(--git-orange);
  }
  .cg__ptr--feature .cg__pill {
    stroke: var(--gp-feature);
  }
  .cg__ptr--feature .cg__tip {
    fill: var(--gp-feature);
  }
  .cg__ptr--alt .cg__pill {
    stroke: var(--gp-alt);
  }
  .cg__ptr--alt .cg__tip {
    fill: var(--gp-alt);
  }
  .cg__ptr--origin .cg__pill {
    stroke: var(--gp-feature);
    fill: color-mix(in srgb, var(--gp-feature) 14%, var(--sl-color-gray-6));
  }
  .cg__ptr--origin .cg__ptext {
    fill: #9ccbff;
  }
  .cg__ptr--origin .cg__tip {
    fill: var(--gp-feature);
  }
  .cg__ptr--head .cg__pill {
    fill: var(--git-orange);
    stroke: color-mix(in srgb, var(--git-orange) 55%, #000);
    filter: drop-shadow(0 0 0 transparent);
    animation: cg-head-glow 2.4s ease-in-out infinite;
  }
  .cg__ptr--head .cg__ptext {
    fill: #fff;
    font-weight: 800;
    letter-spacing: 0.03em;
  }
  .cg__ptr--head .cg__tip {
    fill: var(--git-orange);
  }
  .cg__ptr--detached .cg__pill {
    fill: #b3261e;
    stroke: #7a1813;
    animation: none;
  }
  .cg__ptr--detached .cg__tip {
    fill: #b3261e;
  }

  @keyframes cg-head-glow {
    0%,
    100% {
      filter: drop-shadow(
        0 0 1px color-mix(in srgb, var(--git-orange) 40%, transparent)
      );
    }
    50% {
      filter: drop-shadow(
        0 0 6px color-mix(in srgb, var(--git-orange) 85%, transparent)
      );
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .cg__ptr--head .cg__pill {
      animation: none;
    }
  }
</style>
