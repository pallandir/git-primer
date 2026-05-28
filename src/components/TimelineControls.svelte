<script>
  import { onDestroy } from "svelte";

  let {
    count,
    step = $bindable(0),
    interval = 1600,
    loop = false,
    labels = [],
    nextLabel = null,
    autoplay = false,
  } = $props();

  let playing = $state(false);
  let timer = null;

  function clear() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  function pause() {
    playing = false;
    clear();
  }

  function next() {
    if (step < count - 1) {
      step += 1;
    } else if (loop) {
      step = 0;
    } else {
      pause();
    }
  }

  function prev() {
    pause();
    if (step > 0) step -= 1;
  }

  function play() {
    if (playing) return;
    if (step >= count - 1) step = 0;
    playing = true;
    timer = setInterval(next, interval);
  }

  function toggle() {
    playing ? pause() : play();
  }

  function restart() {
    pause();
    step = 0;
  }

  function onScrub(event) {
    pause();
    step = Number(event.currentTarget.value);
  }

  let atEnd = $derived(step >= count - 1);
  let cta = $derived(
    nextLabel ?? (labels.length ? labels[Math.min(step + 1, count - 1)] : "Next"),
  );

  onDestroy(clear);
</script>

<div class="tl">
  <div class="tl__buttons">
    {#if autoplay}
      <button
        class="tl__btn tl__play"
        class:tl__play--on={playing}
        onclick={toggle}
        aria-label={playing ? "Pause" : "Play"}
        title={playing ? "Pause" : "Play"}
      >
        {#if playing}
          <svg viewBox="0 0 24 24" aria-hidden="true"
            ><rect x="6" y="5" width="4" height="14" rx="1" /><rect
              x="14"
              y="5"
              width="4"
              height="14"
              rx="1"
            /></svg
          >
        {:else}
          <svg viewBox="0 0 24 24" aria-hidden="true"
            ><path d="M7 5l12 7-12 7z" /></svg
          >
        {/if}
      </button>
    {/if}

    <button class="tl__btn" onclick={prev} disabled={step === 0} aria-label="Previous step">
      ◂ Prev
    </button>

    <button
      class="tl__btn tl__btn--primary"
      onclick={() => {
        pause();
        next();
      }}
      disabled={atEnd && !loop}
    >
      {atEnd ? "Done" : cta}{atEnd ? "" : " ▸"}
    </button>

    <button
      class="tl__btn"
      onclick={restart}
      disabled={step === 0 && !playing}
      aria-label="Restart"
    >
      ↺ Restart
    </button>
  </div>

  <div class="tl__scrub">
    <input
      type="range"
      min="0"
      max={count - 1}
      value={step}
      oninput={onScrub}
      aria-label="Timeline scrubber"
      style={`--p:${count > 1 ? (step / (count - 1)) * 100 : 0}%`}
    />
    <span class="tl__count">{step + 1} / {count}</span>
  </div>
</div>

<style>
  .tl {
    --ctl-h: 2.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  .tl__buttons {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
  }
  .tl__btn {
    height: var(--ctl-h);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.3rem;
    font: inherit;
    font-size: 0.82rem;
    line-height: 1;
    cursor: pointer;
    border: 1px solid var(--sl-color-gray-5);
    background: var(--sl-color-gray-6);
    color: var(--sl-color-white);
    padding: 0 0.9rem;
    border-radius: 0.5rem;
    transition:
      transform 0.12s ease,
      border-color 0.12s ease,
      background 0.12s ease,
      box-shadow 0.2s ease;
  }
  .tl__btn:hover:not(:disabled) {
    border-color: var(--git-orange);
    transform: translateY(-1px);
  }
  .tl__btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
  .tl__btn--primary {
    background: var(--git-orange);
    border-color: var(--git-orange);
    color: #fff;
    font-weight: 600;
  }
  .tl__play {
    width: var(--ctl-h);
    padding: 0;
    border-radius: 999px;
    border-color: var(--git-orange);
    background: var(--git-orange);
    color: #fff;
  }
  .tl__play:hover:not(:disabled) {
    box-shadow: 0 6px 18px color-mix(in srgb, var(--git-orange) 45%, transparent);
  }
  .tl__play--on {
    background: var(--sl-color-gray-6);
    border-color: var(--sl-color-gray-5);
    color: var(--git-orange);
  }
  .tl__play svg {
    width: 1.15rem;
    height: 1.15rem;
    fill: currentColor;
  }
  .tl__scrub {
    display: flex;
    align-items: center;
    gap: 0.7rem;
  }
  .tl__count {
    white-space: nowrap;
    font-size: 0.75rem;
    color: var(--sl-color-gray-3);
    font-variant-numeric: tabular-nums;
  }
  input[type="range"] {
    -webkit-appearance: none;
    appearance: none;
    flex: 1;
    height: 0.4rem;
    border-radius: 999px;
    background: linear-gradient(
      to right,
      var(--git-orange) var(--p, 0%),
      var(--sl-color-gray-5) var(--p, 0%)
    );
    cursor: pointer;
  }
  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    background: #fff;
    border: 3px solid var(--git-orange);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
    cursor: pointer;
  }
  input[type="range"]::-moz-range-thumb {
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    background: #fff;
    border: 3px solid var(--git-orange);
    cursor: pointer;
  }
</style>
