<script>
  import { fade } from "svelte/transition";

  const MAIN_Y = 50;
  const FEAT_Y = 115;

  let rebased = $state(false);

  // main commits (fixed)
  const main = [
    { id: "A", x: 70 },
    { id: "B", x: 160 },
    { id: "C", x: 250 },
  ];

  // feature commits move when rebased: from the lower lane onto the tip of main.
  let feature = $derived(
    rebased
      ? [
          { id: "D'", x: 340, y: MAIN_Y },
          { id: "E'", x: 430, y: MAIN_Y },
        ]
      : [
          { id: "D", x: 250, y: FEAT_Y },
          { id: "E", x: 340, y: FEAT_Y },
        ],
  );

  let caption = $derived(
    rebased
      ? "git rebase main replayed D and E on top of C as brand new commits (D', E'). History is now linear, as if feature had started from the latest main."
      : "feature branched off B. Meanwhile main moved on to C. The two lines have diverged.",
  );
</script>

<div class="git-demo">
  <div class="git-demo__bar">
    <button
      class="git-demo__btn git-demo__btn--primary"
      onclick={() => (rebased = true)}
      disabled={rebased}
    >
      git rebase main
    </button>
    <button
      class="git-demo__btn"
      onclick={() => (rebased = false)}
      disabled={!rebased}
    >
      Reset
    </button>
  </div>

  <svg viewBox="0 0 500 160" class="graph" role="img" aria-label="git rebase replaying commits">
    <text x="18" y={MAIN_Y + 4} class="lane-label main">main</text>
    <text x="14" y={FEAT_Y + 4} class="lane-label feat" class:hide={rebased}>feature</text>

    <!-- main edges -->
    <line x1={main[0].x} y1={MAIN_Y} x2={main[1].x} y2={MAIN_Y} class="edge" />
    <line x1={main[1].x} y1={MAIN_Y} x2={main[2].x} y2={MAIN_Y} class="edge" />

    <!-- feature edges -->
    {#if rebased}
      <line x1={250} y1={MAIN_Y} x2={340} y2={MAIN_Y} class="edge feat-edge on" />
      <line x1={340} y1={MAIN_Y} x2={430} y2={MAIN_Y} class="edge feat-edge on" />
    {:else}
      <line x1={160} y1={MAIN_Y} x2={250} y2={FEAT_Y} class="edge feat-edge on" />
      <line x1={250} y1={FEAT_Y} x2={340} y2={FEAT_Y} class="edge feat-edge on" />
    {/if}

    <!-- main nodes -->
    {#each main as c}
      <g>
        <circle cx={c.x} cy={MAIN_Y} r="15" class="node main-node" />
        <text x={c.x} y={MAIN_Y + 4} class="node-text">{c.id}</text>
      </g>
    {/each}

    <!-- feature nodes (animate position) -->
    {#each feature as c (c.id.replace("'", ""))}
      <g class="feat-node-g" style={`transform: translate(${c.x}px, ${c.y}px)`}>
        <circle r="15" class="node feat-node" />
        <text y="4" class="node-text">{c.id}</text>
      </g>
    {/each}
  </svg>

  {#key caption}
    <p class="git-demo__caption" in:fade={{ duration: 250 }}>{caption}</p>
  {/key}
</div>

<style>
  .graph {
    width: 100%;
    height: auto;
  }
  .lane-label {
    font-size: 12px;
    font-weight: 700;
  }
  .lane-label.main {
    fill: var(--git-orange);
  }
  .lane-label.feat {
    fill: #4aa3ff;
    transition: opacity 0.4s ease;
  }
  .lane-label.feat.hide {
    opacity: 0;
  }
  .edge {
    stroke: var(--sl-color-gray-4);
    stroke-width: 3;
  }
  .feat-edge {
    stroke: #4aa3ff;
  }
  .node {
    stroke: #fff2;
    stroke-width: 2;
  }
  .main-node {
    fill: var(--git-orange);
  }
  .feat-node {
    fill: #4aa3ff;
  }
  .feat-node-g {
    transition: transform 0.7s cubic-bezier(0.5, 0, 0.2, 1);
  }
  .node-text {
    font-size: 11px;
    font-weight: 700;
    fill: #fff;
    text-anchor: middle;
    pointer-events: none;
  }
</style>
