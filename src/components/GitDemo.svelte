<script>
  import { fade } from "svelte/transition";

  let {
    caption = "",
    step = null,
    count = null,
    controls = null,
    children,
  } = $props();
</script>

<div class="gd">
  {#if controls}
    <div class="gd__controls">{@render controls()}</div>
  {/if}

  <div class="gd__body">
    <div class="gd__stage">
      {@render children?.()}
    </div>

    <aside class="gd__caption">
      {#if step !== null && count}
        <span class="gd__step">Step {step + 1} of {count}</span>
      {/if}
      {#key caption}
        <p class="gd__caption-text" in:fade={{ duration: 240 }}>{caption}</p>
      {/key}
    </aside>
  </div>
</div>

<style>
  .gd {
    border: 1px solid var(--sl-color-gray-5);
    border-radius: 0.85rem;
    background: var(--sl-color-black);
    padding: 1.1rem 1.25rem 1.25rem;
    margin: 1.75rem 0;
  }

  .gd__controls {
    margin-bottom: 1rem;
  }

  .gd__body {
    display: grid;
    grid-template-columns: minmax(0, 1.65fr) minmax(15rem, 1fr);
    gap: 1.25rem;
    align-items: stretch;
  }

  .gd__stage {
    min-width: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .gd__caption {
    border-left: 1px solid var(--sl-color-gray-5);
    padding-left: 1.1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    justify-content: center;
  }

  .gd__step {
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--sl-color-gray-4);
    font-variant-numeric: tabular-nums;
  }

  .gd__caption-text {
    margin: 0;
    font-size: 1rem;
    line-height: 1.55;
    color: var(--sl-color-gray-1);
  }

  @media (max-width: 900px) {
    .gd__body {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
    .gd__caption {
      border-left: none;
      border-top: 1px solid var(--sl-color-gray-5);
      padding-left: 0;
      padding-top: 1rem;
    }
  }
</style>
