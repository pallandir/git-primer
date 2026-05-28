<script>
  import { fade } from "svelte/transition";

  const MAIN_Y = 50;
  const FIX_Y = 120;
  let picked = $state(false);

  let caption = $derived(
    picked
      ? "git cherry-pick copied just the bug-fix commit (X) onto main as a new commit (X'), with a new hash. The rest of the fix branch was left behind."
      : "A bug was fixed on the fix branch (commit X). We want only that single commit on main, not the whole branch.",
  );
</script>

<div class="git-demo">
  <div class="git-demo__bar">
    <button
      class="git-demo__btn git-demo__btn--primary"
      onclick={() => (picked = true)}
      disabled={picked}
    >
      git cherry-pick X
    </button>
    <button class="git-demo__btn" onclick={() => (picked = false)} disabled={!picked}>
      Reset
    </button>
  </div>

  <svg viewBox="0 0 500 165" class="graph" role="img" aria-label="git cherry-pick a single commit">
    <text x="14" y={MAIN_Y + 4} class="lane-label main">main</text>
    <text x="30" y={FIX_Y + 4} class="lane-label fix">fix</text>

    <!-- main line -->
    <line x1="70" y1={MAIN_Y} x2="160" y2={MAIN_Y} class="edge" />
    <line x1="160" y1={MAIN_Y} x2="250" y2={MAIN_Y} class="edge" />
    {#if picked}
      <line x1="250" y1={MAIN_Y} x2="340" y2={MAIN_Y} class="edge pick on" />
    {/if}

    <!-- fix line -->
    <line x1="160" y1={MAIN_Y} x2="250" y2={FIX_Y} class="edge fix-edge" />
    <line x1="250" y1={FIX_Y} x2="340" y2={FIX_Y} class="edge fix-edge" />

    {#each [{ id: "A", x: 70 }, { id: "B", x: 160 }, { id: "C", x: 250 }] as c}
      <g>
        <circle cx={c.x} cy={MAIN_Y} r="15" class="node main-node" />
        <text x={c.x} y={MAIN_Y + 4} class="node-text">{c.id}</text>
      </g>
    {/each}

    <!-- fix commits -->
    <g>
      <circle cx="250" cy={FIX_Y} r="15" class="node fix-node" />
      <text x="250" y={FIX_Y + 4} class="node-text">Y</text>
    </g>
    <g class="pick-source" class:lifted={picked}>
      <circle cx="340" cy={FIX_Y} r="15" class="node pick-node" />
      <text x="340" y={FIX_Y + 4} class="node-text">X</text>
    </g>

    <!-- the cherry-picked copy on main -->
    {#if picked}
      <g in:fade={{ duration: 400, delay: 250 }}>
        <circle cx="340" cy={MAIN_Y} r="15" class="node pick-node" />
        <text x="340" y={MAIN_Y + 4} class="node-text">X'</text>
        <text x="375" y={MAIN_Y - 18} class="cherry">🍒</text>
      </g>
    {/if}
  </svg>

  {#key caption}
    <p class="git-demo__caption" in:fade={{ duration: 250 }}>{caption}</p>
  {/key}
</div>

<style>
  .graph { width: 100%; height: auto; }
  .lane-label { font-size: 12px; font-weight: 700; }
  .lane-label.main { fill: var(--git-orange); }
  .lane-label.fix { fill: #b07cff; }
  .edge { stroke: var(--sl-color-gray-4); stroke-width: 3; }
  .fix-edge { stroke: #b07cff; }
  .pick { stroke: #ff5fa2; }
  .node { stroke: #fff2; stroke-width: 2; }
  .main-node { fill: var(--git-orange); }
  .fix-node { fill: #b07cff; }
  .pick-node { fill: #ff5fa2; }
  .node-text { font-size: 11px; font-weight: 700; fill: #fff; text-anchor: middle; pointer-events: none; }
  .cherry { font-size: 16px; text-anchor: middle; }
  .pick-source { transition: opacity 0.4s ease; }
  .pick-source.lifted { opacity: 0.3; }
</style>
