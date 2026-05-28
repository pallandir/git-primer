<script>
  import { fade } from "svelte/transition";
  import { backOut } from "svelte/easing";
  import { R, edgePath, pillW } from "./flow/graph.js";

  let {
    nodes = [],
    edges = [],
    pointers = [],
    width = 540,
    height = 230,
    label = "Git commit graph",
  } = $props();

  let map = $derived(Object.fromEntries(nodes.map((n) => [n.id, n])));

  function pop(_node, { d = 440 } = {}) {
    return {
      duration: d,
      css: (t) => {
        const e = backOut(t);
        return `opacity:${t};transform:scale(${0.3 + 0.7 * e})`;
      },
    };
  }

  function ptrXY(p) {
    const n = map[p.at];
    if (!n) return null;
    return { x: n.x, y: n.y - R - 16 - (p.level ?? 0) * 25 };
  }
</script>

<svg viewBox={`0 0 ${width} ${height}`} class="cg" role="img" aria-label={label}>
  {#each edges as e (e.id)}
    {#if map[e.from] && map[e.to]}
      <path
        d={edgePath(map[e.from], map[e.to])}
        class={`cg__edge cg__edge--${e.variant ?? "main"}`}
        class:cg__edge--ghost={e.ghost}
        fill="none"
        in:fade={{ duration: 320 }}
        out:fade={{ duration: 200 }}
      />
    {/if}
  {/each}

  {#each nodes as n (n.id)}
    <g class="cg__node" style={`transform:translate(${n.x}px,${n.y}px)`}>
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

  {#each pointers as p (p.key)}
    {@const xy = ptrXY(p)}
    {#if xy}
      {@const w = pillW(p.label)}
      <g
        class={`cg__ptr cg__ptr--${p.variant ?? "branch"}`}
        class:cg__ptr--detached={p.detached}
        style={`transform:translate(${xy.x}px,${xy.y}px)`}
      >
        <g in:pop={{ d: 360 }}>
          <rect x={-w / 2} y="-13" width={w} height="22" rx="6" class="cg__pill" />
          <text class="cg__ptext">{p.label}</text>
          <path d="M0 9 L-5 16 L5 16 Z" class="cg__tip" />
        </g>
      </g>
    {/if}
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
    stroke: #4aa3ff;
  }
  .cg__edge--alt {
    stroke: #b07cff;
  }
  .cg__edge--pick {
    stroke: #ff5fa2;
  }
  .cg__edge--ghost {
    stroke: var(--sl-color-gray-5);
    stroke-dasharray: 5 4;
    opacity: 0.55;
  }

  .cg__node {
    transition: transform 0.6s cubic-bezier(0.34, 1.18, 0.64, 1);
  }
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
    fill: #4aa3ff;
    stroke: #1f6fbf;
  }
  .cg__dot--alt {
    fill: #b07cff;
    stroke: #6b3fb0;
  }
  .cg__dot--pick {
    fill: #ff5fa2;
    stroke: #b03f6e;
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

  .cg__ptr {
    transition: transform 0.6s cubic-bezier(0.34, 1.18, 0.64, 1);
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
    stroke: #4aa3ff;
  }
  .cg__ptr--feature .cg__tip {
    fill: #4aa3ff;
  }
  .cg__ptr--alt .cg__pill {
    stroke: #b07cff;
  }
  .cg__ptr--alt .cg__tip {
    fill: #b07cff;
  }
  .cg__ptr--origin .cg__pill {
    stroke: #4aa3ff;
    fill: color-mix(in srgb, #4aa3ff 14%, var(--sl-color-gray-6));
  }
  .cg__ptr--origin .cg__ptext {
    fill: #9ccbff;
  }
  .cg__ptr--origin .cg__tip {
    fill: #4aa3ff;
  }
  .cg__ptr--head .cg__pill {
    fill: var(--git-orange);
    stroke: color-mix(in srgb, var(--git-orange) 55%, #000);
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
  }
  .cg__ptr--detached .cg__tip {
    fill: #b3261e;
  }
</style>
