<script>
  import { scale } from "svelte/transition";
  import { backOut } from "svelte/easing";
  import GitDemo from "./GitDemo.svelte";
  import { DUR } from "./flow/graph.js";

  let packed = $state(false);

  // A scattered pile of loose objects, the way a young repo keeps them: one
  // zlib-compressed file per object under .git/objects/.
  const loose = [
    { id: "o1", kind: "commit", x: 70, y: 36 },
    { id: "o2", kind: "tree", x: 150, y: 70 },
    { id: "o3", kind: "blob", x: 56, y: 104 },
    { id: "o4", kind: "blob", x: 158, y: 132 },
    { id: "o5", kind: "commit", x: 96, y: 158 },
    { id: "o6", kind: "tree", x: 36, y: 70 },
    { id: "o7", kind: "blob", x: 120, y: 30 },
  ];

  const CENTER = { x: 430, y: 96 };

  let caption = $derived(
    packed
      ? "git gc rolled every loose object into one packfile (.pack), plus an index (.idx) so Git can still find each object fast. Similar objects are stored as deltas against one another, so the pack is much smaller than the loose files combined."
      : "A fresh repo keeps each object as its own zlib-compressed file under .git/objects/. Run git gc to see what Git does as history grows.",
  );
</script>

<GitDemo {caption}>
  {#snippet controls()}
    <div class="gd__choices">
      <button
        class="git-demo__btn git-demo__btn--primary"
        onclick={() => (packed = true)}
        disabled={packed}
      >
        git gc ▸
      </button>
      <button
        class="git-demo__btn"
        onclick={() => (packed = false)}
        disabled={!packed}
      >
        ↺ Reset
      </button>
    </div>
  {/snippet}

  <div class="pk">
    <svg viewBox="0 0 560 200" class="pk__svg" role="img" aria-label="Loose objects packed into a packfile">
      <text x="14" y="18" class="pk__zone-label">.git/objects/ (loose)</text>

      {#each loose as o (o.id)}
        <g
          class="pk__obj"
          class:pk__obj--packed={packed}
          style={`transform: translate(${packed ? CENTER.x : o.x}px, ${packed ? CENTER.y : o.y}px) scale(${packed ? 0.2 : 1}); opacity:${packed ? 0 : 1};`}
        >
          <circle r="15" class={`pk__dot pk__dot--${o.kind}`} />
        </g>
      {/each}

      {#if packed}
        <g in:scale={{ duration: DUR.pop, start: 0.5, easing: backOut, delay: 200 }}>
          <rect x="350" y="46" width="170" height="100" rx="10" class="pk__pack" />
          <text x="435" y="74" class="pk__pack-name">pack-a1b2c3.pack</text>
          <text x="435" y="98" class="pk__pack-sub">+ pack-a1b2c3.idx</text>
          <text x="435" y="124" class="pk__pack-delta">deltas, zlib-compressed</text>
        </g>
      {/if}
    </svg>
  </div>
</GitDemo>

<style>
  .pk__svg {
    width: 100%;
    height: auto;
    display: block;
    overflow: visible;
  }
  .pk__zone-label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.03em;
    fill: var(--sl-color-gray-3);
    font-family: var(--__sl-font-mono, monospace);
  }
  .pk__obj {
    transition:
      transform var(--gp-dur-move) var(--gp-ease-move),
      opacity 0.4s ease;
  }
  .pk__dot {
    stroke-width: 2.5;
  }
  .pk__dot--commit {
    fill: var(--git-orange);
    stroke: color-mix(in srgb, var(--git-orange) 45%, #000);
  }
  .pk__dot--tree {
    fill: var(--gp-feature);
    stroke: var(--gp-feature-stroke);
  }
  .pk__dot--blob {
    fill: var(--gp-green);
    stroke: color-mix(in srgb, var(--gp-green) 45%, #000);
  }
  .pk__pack {
    fill: var(--sl-color-gray-6);
    stroke: var(--git-orange);
    stroke-width: 2;
  }
  .pk__pack-name {
    font-size: 13px;
    font-weight: 800;
    fill: var(--git-orange);
    text-anchor: middle;
    font-family: var(--__sl-font-mono, monospace);
  }
  .pk__pack-sub {
    font-size: 11px;
    fill: var(--sl-color-gray-2);
    text-anchor: middle;
    font-family: var(--__sl-font-mono, monospace);
  }
  .pk__pack-delta {
    font-size: 10px;
    fill: var(--sl-color-gray-3);
    text-anchor: middle;
    font-style: italic;
  }
</style>
