<script>
  import { fade } from "svelte/transition";

  // Commit graph laid out on two lanes: main (top) and feature (bottom).
  const MAIN_Y = 55;
  const FEAT_Y = 120;

  const commits = [
    { id: "C1", x: 70, y: MAIN_Y, lane: "main", at: 0 },
    { id: "C2", x: 160, y: MAIN_Y, lane: "main", at: 0 },
    { id: "C3", x: 250, y: FEAT_Y, lane: "feat", at: 2 },
    { id: "C4", x: 340, y: FEAT_Y, lane: "feat", at: 3 },
    { id: "M", x: 430, y: MAIN_Y, lane: "main", at: 4 },
  ];

  const edges = [
    { from: "C1", to: "C2", at: 0 },
    { from: "C2", to: "C3", at: 2 }, // branch off
    { from: "C3", to: "C4", at: 3 },
    { from: "C2", to: "M", at: 4 }, // main continues
    { from: "C4", to: "M", at: 4 }, // merge back
  ];

  const captions = [
    "main has two commits. This is our stable line of development.",
    "git switch -c feature creates a new branch pointing at the same commit. Nothing is copied.",
    "We commit on feature. main is untouched and stays safe.",
    "Another commit on feature. The two lines have now diverged.",
    "git merge feature joins the work back into main with a merge commit (M).",
  ];

  let step = $state(0);
  let caption = $derived(captions[step]);
  const byId = Object.fromEntries(commits.map((c) => [c.id, c]));

  function next() {
    if (step < 4) step += 1;
  }
  function reset() {
    step = 0;
  }

  const labels = [
    "Two commits on main",
    "Create feature branch",
    "Commit on feature",
    "Commit on feature",
    "Merge into main",
  ];
</script>

<div class="git-demo">
  <div class="git-demo__bar">
    <button
      class="git-demo__btn git-demo__btn--primary"
      onclick={next}
      disabled={step >= 4}
    >
      {step < 4 ? labels[step + 1] : "Merged"} ▸
    </button>
    <button class="git-demo__btn" onclick={reset} disabled={step === 0}>
      Reset
    </button>
    <span class="git-demo__hint">Step {step + 1} / 5</span>
  </div>

  <svg viewBox="0 0 500 170" class="graph" role="img" aria-label="Git branching and merging diagram">
    <!-- lane guides -->
    <line x1="20" y1={MAIN_Y} x2="480" y2={MAIN_Y} class="lane" />
    <line x1="20" y1={FEAT_Y} x2="480" y2={FEAT_Y} class="lane" />
    <text x="18" y={MAIN_Y - 16} class="lane-label main-label">main</text>
    <text x="18" y={FEAT_Y + 26} class="lane-label feat-label" class:on={step >= 1}>feature</text>

    <!-- edges -->
    {#each edges as e}
      <line
        x1={byId[e.from].x}
        y1={byId[e.from].y}
        x2={byId[e.to].x}
        y2={byId[e.to].y}
        class="edge"
        class:on={step >= e.at}
        class:merge={e.to === "M"}
      />
    {/each}

    <!-- commits -->
    {#each commits as c}
      <g class="commit" class:on={step >= c.at}>
        <circle cx={c.x} cy={c.y} r="13" class={c.id === "M" ? "node merge-node" : c.lane === "main" ? "node main-node" : "node feat-node"} />
        <text x={c.x} y={c.y + 4} class="node-text">{c.id}</text>
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
  .lane {
    stroke: var(--sl-color-gray-5);
    stroke-width: 1;
    stroke-dasharray: 4 4;
  }
  .lane-label {
    font-size: 12px;
    font-weight: 700;
    fill: var(--sl-color-gray-4);
  }
  .main-label {
    fill: var(--git-orange);
  }
  .feat-label {
    opacity: 0;
    transition: opacity 0.4s ease;
  }
  .feat-label.on {
    opacity: 1;
    fill: #4aa3ff;
  }
  .edge {
    stroke: var(--sl-color-gray-4);
    stroke-width: 3;
    opacity: 0;
    transition: opacity 0.5s ease;
  }
  .edge.on {
    opacity: 1;
  }
  .edge.merge {
    stroke: var(--git-orange);
  }
  .commit {
    opacity: 0;
    transform: scale(0.2);
    transform-box: fill-box;
    transform-origin: center;
    transition:
      opacity 0.45s ease,
      transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .commit.on {
    opacity: 1;
    transform: scale(1);
  }
  .node {
    stroke-width: 2.5;
  }
  .main-node {
    fill: var(--git-orange);
    stroke: #fff2;
  }
  .feat-node {
    fill: #4aa3ff;
    stroke: #fff2;
  }
  .merge-node {
    fill: var(--sl-color-gray-6);
    stroke: var(--git-orange);
  }
  .node-text {
    font-size: 11px;
    font-weight: 700;
    fill: #fff;
    text-anchor: middle;
    pointer-events: none;
  }
</style>
