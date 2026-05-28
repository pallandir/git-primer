<script>
  import { fade, fly } from "svelte/transition";
  import GitDemo from "./GitDemo.svelte";
  import TimelineControls from "./TimelineControls.svelte";

  const captions = [
    "Step through how one commit references your whole project.",
    "The commit stores metadata (author, date, message) and points to one tree.",
    "The tree represents your project folder. It points to blobs and other trees.",
    "Blobs hold the actual file contents. Identical files are stored only once.",
  ];

  let revealed = $state(0);
</script>

<GitDemo caption={captions[revealed]} step={revealed} count={captions.length}>
  {#snippet controls()}
    <TimelineControls
      count={4}
      bind:step={revealed}
      interval={2000}
      labels={["", "Show commit", "Show tree", "Show blobs"]}
    />
  {/snippet}

  <div class="model">
    {#if revealed >= 1}
      <div class="obj obj--commit" in:fly={{ y: 16, duration: 350 }}>
        <span class="obj__type">commit</span>
        <span class="obj__hash">a1b2c3d</span>
        <span class="obj__meta">"Add login form"</span>
      </div>
    {/if}

    {#if revealed >= 2}
      <div class="arrow" in:fade>↓ points to</div>
      <div class="obj obj--tree" in:fly={{ y: 16, duration: 350 }}>
        <span class="obj__type">tree</span>
        <span class="obj__hash">f9e8d7c</span>
        <span class="obj__meta">project root</span>
      </div>
    {/if}

    {#if revealed >= 3}
      <div class="arrow" in:fade>↓ points to</div>
      <div class="blobs" in:fly={{ y: 16, duration: 350 }}>
        <div class="obj obj--blob">
          <span class="obj__type">blob</span>
          <span class="obj__meta">📄 app.js</span>
        </div>
        <div class="obj obj--blob">
          <span class="obj__type">blob</span>
          <span class="obj__meta">📄 README.md</span>
        </div>
      </div>
    {/if}

    {#if revealed === 0}
      <p class="placeholder">Press play, or step forward, to peel back the layers of a commit.</p>
    {/if}
  </div>
</GitDemo>

<style>
  .model {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    min-height: 12rem;
    width: 100%;
    justify-content: center;
  }
  .obj {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.15rem;
    padding: 0.6rem 1.1rem;
    border-radius: 0.6rem;
    border: 2px solid;
    min-width: 9rem;
  }
  .obj__type {
    font-size: 0.68rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-weight: 800;
    opacity: 0.85;
  }
  .obj__hash {
    font-family: monospace;
    font-size: 0.8rem;
  }
  .obj__meta {
    font-size: 0.78rem;
    color: var(--sl-color-gray-2);
  }
  .obj--commit {
    border-color: var(--git-orange);
    background: color-mix(in srgb, var(--git-orange) 14%, transparent);
  }
  .obj--tree {
    border-color: #4aa3ff;
    background: color-mix(in srgb, #4aa3ff 14%, transparent);
  }
  .obj--blob {
    border-color: #7ee2a8;
    background: color-mix(in srgb, #7ee2a8 12%, transparent);
  }
  .blobs {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
    justify-content: center;
  }
  .arrow {
    font-size: 0.75rem;
    color: var(--sl-color-gray-3);
  }
  .placeholder {
    color: var(--sl-color-gray-4);
    font-size: 0.9rem;
    text-align: center;
  }
</style>
