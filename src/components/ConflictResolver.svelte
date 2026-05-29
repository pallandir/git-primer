<script>
  import { flip } from "svelte/animate";
  import GitDemo from "./GitDemo.svelte";
  import { DUR } from "./flow/graph.js";

  const ours = 'const greeting = "Hello team";';
  const theirs = 'const greeting = "Hello world";';

  let resolution = $state(null); // null | 'ours' | 'theirs' | 'both'

  const conflict = [
    { id: "m1", role: "mk-ours", text: "<<<<<<< HEAD" },
    { id: "ours", role: "ours", text: ours },
    { id: "sep", role: "mk-sep", text: "=======" },
    { id: "theirs", role: "theirs", text: theirs },
    { id: "m2", role: "mk-theirs", text: ">>>>>>> feature" },
  ];

  const lines = $derived(
    resolution === null
      ? conflict
      : resolution === "ours"
        ? [{ id: "ours", role: "kept", text: ours }]
        : resolution === "theirs"
          ? [{ id: "theirs", role: "kept", text: theirs }]
          : [
              { id: "ours", role: "kept", text: ours },
              { id: "theirs", role: "kept", text: theirs },
            ],
  );

  let caption = $derived(
    resolution === null
      ? "Git marked the conflict. Pick which side to keep, and watch it strip out the markers for you."
      : resolution === "ours"
        ? "Kept your current branch's version (the part between <<<<<<< and =======)."
        : resolution === "theirs"
          ? "Kept the incoming branch's version (the part between ======= and >>>>>>>)."
          : "Kept both lines. Sometimes the right answer is to combine them.",
  );

  function collapse(node, { duration = 340 } = {}) {
    const h = node.offsetHeight;
    return {
      duration,
      css: (t, u) =>
        `opacity:${t}; max-height:${t * h}px; transform:translateX(${u * -14}px); overflow:hidden;`,
    };
  }
</script>

<GitDemo {caption}>
  {#snippet controls()}
    <div class="gd__choices">
      <button class="git-demo__btn git-demo__btn--primary" onclick={() => (resolution = "ours")}>
        Keep ours (HEAD)
      </button>
      <button class="git-demo__btn git-demo__btn--primary" onclick={() => (resolution = "theirs")}>
        Keep theirs
      </button>
      <button class="git-demo__btn" onclick={() => (resolution = "both")}>Keep both</button>
      <button class="git-demo__btn" onclick={() => (resolution = null)} disabled={resolution === null}>
        ↺ Reset
      </button>
    </div>
  {/snippet}

  <div class="code-frame">
    <div class="code-frame__name">app.js</div>
    <pre class="code"><code>{#each lines as line (line.id)}<span
          class="line line--{line.role}"
          animate:flip={{ duration: DUR.move }}
          out:collapse>{line.text}</span>{/each}</code></pre>
  </div>
</GitDemo>

<style>
  .code-frame {
    border: 1px solid var(--sl-color-gray-5);
    border-radius: 0.5rem;
    overflow: hidden;
    width: 100%;
  }
  .code-frame__name {
    background: var(--sl-color-gray-6);
    padding: 0.35rem 0.75rem;
    font-size: 0.75rem;
    font-family: var(--__sl-font-mono, monospace);
    color: var(--sl-color-gray-2);
    border-bottom: 1px solid var(--sl-color-gray-5);
  }
  .code {
    margin: 0;
    padding: 0.85rem;
    font-size: 0.82rem;
    line-height: 1.7;
    overflow-x: auto;
    min-height: 9.5rem;
  }
  .line {
    display: block;
    white-space: pre;
  }
  .line--mk-ours,
  .line--mk-sep,
  .line--mk-theirs {
    font-weight: 700;
  }
  .line--mk-ours {
    color: #f59b86;
  }
  .line--mk-sep {
    color: var(--sl-color-gray-3);
  }
  .line--mk-theirs {
    color: #86b8f5;
  }
  .line--ours {
    color: #f5cd6b;
  }
  .line--theirs {
    color: #86d5f5;
  }
  .line--kept {
    color: var(--gp-green);
  }
</style>
