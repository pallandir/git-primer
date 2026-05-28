<script>
  import GitDemo from "./GitDemo.svelte";
  import CommitGraph from "./CommitGraph.svelte";
  import { colX, laneY } from "./flow/graph.js";

  const commits = ["C1", "C2", "C3", "C4"];

  let head = $state(3);
  let mode = $state("clean"); // clean | staged | discarded

  const CLEAN_CAPTION =
    "HEAD points at C4, the latest commit. Your working directory is clean.";

  let caption = $state(CLEAN_CAPTION);

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
  function restart() {
    head = 3;
    mode = "clean";
    caption = CLEAN_CAPTION;
  }

  let nodes = $derived(
    commits.map((id, i) => ({
      id,
      x: colX(i),
      y: laneY("main"),
      variant: "main",
      ghost: i > head,
    })),
  );

  let edges = $derived(
    commits.slice(1).map((id, i) => ({
      id: `e${i}`,
      from: commits[i],
      to: id,
      variant: "main",
      ghost: i + 1 > head,
    })),
  );

  let pointers = $derived([
    { key: "head", label: "HEAD", at: commits[head], variant: "head" },
  ]);
</script>

<GitDemo {caption}>
  {#snippet controls()}
    <div class="gd__choices">
      <button class="git-demo__btn git-demo__btn--primary" onclick={soft} disabled={head <= 0}>
        git reset --soft HEAD~
      </button>
      <button class="git-demo__btn" onclick={hard} disabled={head <= 0}>
        git reset --hard HEAD~
      </button>
      <button class="git-demo__btn" onclick={restart} disabled={head === 3 && mode === "clean"}>
        ↺ Restart
      </button>
    </div>
  {/snippet}

  <CommitGraph {nodes} {edges} {pointers} width={380} height={155} label="HEAD movement during git reset" />

  <div class="state">
    <span class="state__label">Working directory / staging:</span>
    {#if mode === "clean"}
      <span class="pill pill--ok">clean</span>
    {:else if mode === "staged"}
      <span class="pill pill--warn">📄 app.js — staged (changes kept)</span>
    {:else}
      <span class="pill pill--danger">clean (changes discarded)</span>
    {/if}
  </div>
</GitDemo>

<style>
  .state {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.5rem;
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
