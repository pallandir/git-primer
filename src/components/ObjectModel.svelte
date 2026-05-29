<script>
  import { backOut } from "svelte/easing";
  import GitDemo from "./GitDemo.svelte";
  import TimelineControls from "./TimelineControls.svelte";
  import { DUR } from "./flow/graph.js";

  const captions = [
    "Step through how one commit references your whole project.",
    "The commit stores metadata (author, date, message) and points to exactly one tree.",
    "The tree represents your project folder. It points to blobs (files) and other trees.",
    "Blobs hold the raw file contents. A second commit that did not touch README reuses the very same blob, so identical content is stored only once.",
  ];

  let revealed = $state(0);

  function pop(_node, { d = DUR.pop } = {}) {
    return {
      duration: d,
      css: (t) => {
        const e = backOut(t);
        return `opacity:${t};transform:scale(${0.4 + 0.6 * e})`;
      },
    };
  }

  function draw(node, { duration = DUR.draw } = {}) {
    let len = 0;
    try {
      len = node.getTotalLength();
    } catch {
      len = 0;
    }
    return {
      duration,
      css: (t) =>
        `opacity:${t};stroke-dasharray:${len};stroke-dashoffset:${len * (1 - t)}`,
    };
  }
</script>

<GitDemo caption={captions[revealed]} step={revealed} count={captions.length}>
  {#snippet controls()}
    <TimelineControls
      count={4}
      bind:step={revealed}
      interval={2200}
      labels={["", "Show commit", "Show tree", "Show blobs"]}
    />
  {/snippet}

  <div class="om">
    <svg viewBox="0 0 600 300" class="om__svg" role="img" aria-label="A commit pointing to its tree and blobs">
      <defs>
        <marker id="om-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" class="om__arrowhead" />
        </marker>
        <marker id="om-arrow-ghost" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" class="om__arrowhead om__arrowhead--ghost" />
        </marker>
      </defs>

      {#if revealed >= 2}
        <path in:draw class="om__link" d="M300 76 L300 120" marker-end="url(#om-arrow)" fill="none" />
      {/if}
      {#if revealed >= 3}
        <path in:draw class="om__link" d="M285 188 C 230 210, 200 214, 162 230" marker-end="url(#om-arrow)" fill="none" />
        <path in:draw class="om__link" d="M315 188 C 360 210, 380 214, 392 230" marker-end="url(#om-arrow)" fill="none" />
        <path in:draw={{ duration: DUR.draw + 120 }} class="om__link om__link--ghost" d="M498 188 C 460 210, 440 216, 418 230" marker-end="url(#om-arrow-ghost)" fill="none" />
      {/if}

      {#if revealed >= 1}
        <foreignObject x="225" y="8" width="150" height="68">
          <div class="obj obj--commit" in:pop>
            <span class="obj__type">commit</span>
            <span class="obj__hash">a1b2c3d</span>
            <span class="obj__meta">"Add login form"</span>
          </div>
        </foreignObject>
      {/if}

      {#if revealed >= 2}
        <foreignObject x="225" y="120" width="150" height="68">
          <div class="obj obj--tree" in:pop>
            <span class="obj__type">tree</span>
            <span class="obj__hash">f9e8d7c</span>
            <span class="obj__meta">project root</span>
          </div>
        </foreignObject>
      {/if}

      {#if revealed >= 3}
        <foreignObject x="425" y="124" width="150" height="60">
          <div class="obj obj--tree obj--ghost" in:pop>
            <span class="obj__type">tree (next commit)</span>
            <span class="obj__meta">README unchanged</span>
          </div>
        </foreignObject>

        <foreignObject x="70" y="230" width="160" height="62">
          <div class="obj obj--blob" in:pop={{ d: DUR.pop + 60 }}>
            <span class="obj__type">blob</span>
            <span class="obj__meta">📄 app.js</span>
          </div>
        </foreignObject>
        <foreignObject x="320" y="230" width="160" height="62">
          <div class="obj obj--blob obj--blob-shared" in:pop={{ d: DUR.pop + 120 }}>
            <span class="obj__type">blob</span>
            <span class="obj__meta">📄 README.md</span>
            <span class="obj__badge">stored once</span>
          </div>
        </foreignObject>
      {/if}

      {#if revealed === 0}
        <foreignObject x="120" y="120" width="360" height="60">
          <p class="placeholder">Press play, or step forward, to peel back the layers of a commit.</p>
        </foreignObject>
      {/if}
    </svg>
  </div>
</GitDemo>

<style>
  .om {
    width: 100%;
  }
  .om__svg {
    width: 100%;
    height: auto;
    display: block;
    overflow: visible;
  }
  .om__link {
    stroke: var(--git-orange);
    stroke-width: 2.5;
    stroke-linecap: round;
  }
  .om__link--ghost {
    stroke: var(--sl-color-gray-4);
    stroke-dasharray: 5 4;
    opacity: 0.7;
  }
  .om__arrowhead {
    fill: var(--git-orange);
  }
  .om__arrowhead--ghost {
    fill: var(--sl-color-gray-4);
  }
  .obj {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.12rem;
    height: 100%;
    box-sizing: border-box;
    padding: 0.45rem 0.7rem;
    border-radius: 0.6rem;
    border: 2px solid;
    text-align: center;
  }
  .obj__type {
    font-size: 0.62rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-weight: 800;
    opacity: 0.85;
  }
  .obj__hash {
    font-family: var(--__sl-font-mono, monospace);
    font-size: 0.8rem;
  }
  .obj__meta {
    font-size: 0.76rem;
    color: var(--sl-color-gray-2);
  }
  .obj__badge {
    margin-top: 0.15rem;
    font-size: 0.6rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--gp-green);
    border: 1px solid color-mix(in srgb, var(--gp-green) 55%, transparent);
    border-radius: 999px;
    padding: 0.05rem 0.45rem;
  }
  .obj--commit {
    border-color: var(--git-orange);
    background: color-mix(in srgb, var(--git-orange) 14%, transparent);
  }
  .obj--tree {
    border-color: var(--gp-feature);
    background: color-mix(in srgb, var(--gp-feature) 14%, transparent);
  }
  .obj--blob {
    border-color: var(--gp-green);
    background: color-mix(in srgb, var(--gp-green) 12%, transparent);
  }
  .obj--blob-shared {
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--gp-green) 25%, transparent);
  }
  .obj--ghost {
    opacity: 0.55;
    border-style: dashed;
  }
  .placeholder {
    margin: 0;
    color: var(--sl-color-gray-4);
    font-size: 0.9rem;
    text-align: center;
  }
</style>
