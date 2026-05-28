<script>
  import { fade } from "svelte/transition";

  const ours = 'const greeting = "Hello team";';
  const theirs = 'const greeting = "Hello world";';

  let resolution = $state(null); // null | 'ours' | 'theirs' | 'both'

  const resolved = $derived(
    resolution === "ours"
      ? [ours]
      : resolution === "theirs"
        ? [theirs]
        : resolution === "both"
          ? [ours, theirs]
          : null,
  );

  let caption = $derived(
    resolution === null
      ? "Git marked the conflict. Pick which side to keep, then it removes the markers for you."
      : resolution === "ours"
        ? "Kept your current branch's version (between <<<<<<< and =======)."
        : resolution === "theirs"
          ? "Kept the incoming branch's version (between ======= and >>>>>>>)."
          : "Kept both lines. Sometimes the right answer is to combine them.",
  );
</script>

<div class="git-demo">
  <div class="git-demo__bar">
    <button class="git-demo__btn git-demo__btn--primary" onclick={() => (resolution = "ours")}>
      Keep ours (HEAD)
    </button>
    <button class="git-demo__btn git-demo__btn--primary" onclick={() => (resolution = "theirs")}>
      Keep theirs
    </button>
    <button class="git-demo__btn" onclick={() => (resolution = "both")}>Keep both</button>
    <button class="git-demo__btn" onclick={() => (resolution = null)} disabled={resolution === null}>
      Reset
    </button>
  </div>

  <div class="code-frame">
    <div class="code-frame__name">app.js</div>
    {#if resolution === null}
      <pre class="code"><code><span class="mk mk-ours">&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD</span>
<span class="ours-line">{ours}</span>
<span class="mk mk-sep">=======</span>
<span class="theirs-line">{theirs}</span>
<span class="mk mk-theirs">&gt;&gt;&gt;&gt;&gt;&gt;&gt; feature</span></code></pre>
    {:else}
      {#key resolution}
        <pre class="code" in:fade={{ duration: 300 }}><code>{#each resolved as line}<span class="kept-line">{line}</span>{"\n"}{/each}</code></pre>
      {/key}
    {/if}
  </div>

  {#key caption}
    <p class="git-demo__caption" in:fade={{ duration: 250 }}>{caption}</p>
  {/key}
</div>

<style>
  .code-frame {
    border: 1px solid var(--sl-color-gray-5);
    border-radius: 0.5rem;
    overflow: hidden;
  }
  .code-frame__name {
    background: var(--sl-color-gray-6);
    padding: 0.35rem 0.75rem;
    font-size: 0.75rem;
    font-family: monospace;
    color: var(--sl-color-gray-2);
    border-bottom: 1px solid var(--sl-color-gray-5);
  }
  .code {
    margin: 0;
    padding: 0.85rem;
    font-size: 0.82rem;
    line-height: 1.6;
    overflow-x: auto;
  }
  .mk { font-weight: 700; }
  .mk-ours { color: #f59b86; }
  .mk-sep { color: var(--sl-color-gray-3); }
  .mk-theirs { color: #86b8f5; }
  .ours-line { color: #f5cd6b; display: block; }
  .theirs-line { color: #86d5f5; display: block; }
  .kept-line { color: #7ee2a8; display: block; }
</style>
