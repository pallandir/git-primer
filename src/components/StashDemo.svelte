<script>
  import { crossfade, fade } from "svelte/transition";
  const [send, receive] = crossfade({ duration: 450 });

  // state: 0 = dirty working dir, 1 = stashed (clean), 2 = popped back
  let state = $state(0);
  const stashed = $derived(state === 1);

  let caption = $derived(
    state === 0
      ? "You have uncommitted edits in app.js, but you suddenly need a clean working directory to switch branches."
      : state === 1
        ? "git stash tucked your changes onto the stash stack. Your working directory is now clean and safe to switch branches."
        : "git stash pop brought your changes back from the stack into the working directory, right where you left off.",
  );

  function stash() { state = 1; }
  function pop() { state = 2; }
  function reset() { state = 0; }
</script>

<div class="git-demo">
  <div class="git-demo__bar">
    {#if state === 0}
      <button class="git-demo__btn git-demo__btn--primary" onclick={stash}>git stash</button>
    {:else if state === 1}
      <button class="git-demo__btn git-demo__btn--primary" onclick={pop}>git stash pop</button>
    {/if}
    <button class="git-demo__btn" onclick={reset} disabled={state === 0}>Reset</button>
  </div>

  <div class="stash">
    <div class="stash__col">
      <div class="stash__title">Working Directory</div>
      <div class="stash__slot">
        {#if !stashed}
          <div
            class="card"
            in:receive={{ key: "work" }}
            out:send={{ key: "work" }}
          >
            <span>📄</span> app.js <em>(modified)</em>
          </div>
        {:else}
          <div class="clean" in:fade={{ duration: 300, delay: 200 }}>✓ clean</div>
        {/if}
      </div>
    </div>

    <div class="stash__arrow">{stashed ? "→" : "←"}</div>

    <div class="stash__col">
      <div class="stash__title">📦 Stash stack</div>
      <div class="stash__slot">
        {#if stashed}
          <div
            class="card card--stash"
            in:receive={{ key: "work" }}
            out:send={{ key: "work" }}
          >
            stash@&#123;0&#125;
          </div>
        {:else}
          <div class="empty">empty</div>
        {/if}
      </div>
    </div>
  </div>

  {#key caption}
    <p class="git-demo__caption" in:fade={{ duration: 250 }}>{caption}</p>
  {/key}
</div>

<style>
  .stash {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 0.75rem;
  }
  .stash__col {
    border: 1px dashed var(--sl-color-gray-5);
    border-radius: 0.5rem;
    padding: 0.6rem;
    min-height: 6rem;
    display: flex;
    flex-direction: column;
  }
  .stash__title {
    font-size: 0.74rem;
    font-weight: 600;
    color: var(--sl-color-gray-3);
    text-align: center;
    margin-bottom: 0.5rem;
  }
  .stash__slot {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .stash__arrow {
    font-size: 1.5rem;
    color: var(--git-orange);
    font-weight: 700;
  }
  .card {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.45rem 0.7rem;
    border-radius: 0.5rem;
    font-size: 0.8rem;
    font-family: monospace;
    background: var(--git-orange);
    color: #fff;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);
  }
  .card em { opacity: 0.85; font-style: italic; }
  .card--stash { background: #6b4bb0; }
  .clean { color: #7ee2a8; font-weight: 600; }
  .empty { color: var(--sl-color-gray-4); font-size: 0.85rem; }
</style>
