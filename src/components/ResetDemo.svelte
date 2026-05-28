<script>
  import { fade } from "svelte/transition";

  const commits = ["C1", "C2", "C3", "C4"];
  const SPACING = 110;
  const START_X = 60;

  // head = index of the commit HEAD points to.
  let head = $state(3);
  let mode = $state("clean"); // clean | staged | discarded
  let caption = $state(
    "HEAD points at C4, the latest commit. Your working directory is clean.",
  );

  function soft() {
    if (head <= 0) return;
    head -= 1;
    mode = "staged";
    caption =
      "git reset --soft HEAD~ moved HEAD back one commit. The changes from C4 are kept and sit in your staging area, ready to recommit.";
  }
  function hard() {
    if (head <= 0) return;
    head -= 1;
    mode = "discarded";
    caption =
      "git reset --hard HEAD~ moved HEAD back AND threw away the changes from C4. Your working directory is clean again. Use with care!";
  }
  function reset() {
    head = 3;
    mode = "clean";
    caption =
      "HEAD points at C4, the latest commit. Your working directory is clean.";
  }

  let headX = $derived(START_X + head * SPACING);
</script>

<div class="git-demo">
  <div class="git-demo__bar">
    <button class="git-demo__btn git-demo__btn--primary" onclick={soft} disabled={head <= 0}>
      git reset --soft HEAD~
    </button>
    <button class="git-demo__btn" onclick={hard} disabled={head <= 0}>
      git reset --hard HEAD~
    </button>
    <button class="git-demo__btn" onclick={reset} disabled={head === 3 && mode === "clean"}>
      Restart
    </button>
  </div>

  <svg viewBox="0 0 500 150" class="graph" role="img" aria-label="HEAD movement during git reset">
    <line x1={START_X} y1="55" x2={START_X + 3 * SPACING} y2="55" class="lane" />
    {#each commits as c, i}
      <g class="commit" class:orphan={i > head}>
        <circle cx={START_X + i * SPACING} cy="55" r="16" class="node" />
        <text x={START_X + i * SPACING} y="60" class="node-text">{c}</text>
      </g>
    {/each}

    <!-- HEAD pointer -->
    <g class="head" style={`transform: translateX(${headX}px)`}>
      <polygon points="0,82 -7,96 7,96" class="head-arrow" />
      <rect x="-22" y="96" width="44" height="20" rx="5" class="head-box" />
      <text x="0" y="110" class="head-text">HEAD</text>
    </g>
  </svg>

  <div class="state" class:staged={mode === "staged"} class:discarded={mode === "discarded"}>
    <span class="state__label">Working directory / staging:</span>
    {#if mode === "clean"}
      <span class="pill pill--ok">clean</span>
    {:else if mode === "staged"}
      <span class="pill pill--warn">📄 app.js — staged (changes kept)</span>
    {:else}
      <span class="pill pill--danger">clean (changes discarded)</span>
    {/if}
  </div>

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
    stroke-width: 2;
  }
  .commit {
    transition: opacity 0.4s ease;
  }
  .commit.orphan {
    opacity: 0.28;
  }
  .commit.orphan .node {
    fill: var(--sl-color-gray-6);
    stroke-dasharray: 4 3;
  }
  .node {
    fill: var(--git-orange);
    stroke: #fff2;
    stroke-width: 2;
  }
  .node-text {
    font-size: 12px;
    font-weight: 700;
    fill: #fff;
    text-anchor: middle;
    pointer-events: none;
  }
  .head {
    transition: transform 0.55s cubic-bezier(0.34, 1.3, 0.64, 1);
  }
  .head-arrow {
    fill: #4aa3ff;
  }
  .head-box {
    fill: #4aa3ff;
  }
  .head-text {
    font-size: 11px;
    font-weight: 800;
    fill: #fff;
    text-anchor: middle;
  }
  .state {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.75rem;
    font-size: 0.85rem;
  }
  .state__label {
    color: var(--sl-color-gray-3);
  }
  .pill {
    padding: 0.2rem 0.6rem;
    border-radius: 999px;
    font-size: 0.78rem;
    font-weight: 600;
  }
  .pill--ok {
    background: #1f3d2b;
    color: #7ee2a8;
  }
  .pill--warn {
    background: #3d2f0f;
    color: #f5cd6b;
  }
  .pill--danger {
    background: #3d1a14;
    color: #f59b86;
  }
</style>
