<script>
  import { crossfade } from "svelte/transition";
  import GitDemo from "./GitDemo.svelte";
  import TimelineControls from "./TimelineControls.svelte";

  const [send, receive] = crossfade({ duration: 450 });

  const areas = [
    { key: "working", label: "Working Directory", cmd: null },
    { key: "staging", label: "Staging Area", cmd: "git add" },
    { key: "local", label: "Local Repository", cmd: "git commit" },
    { key: "remote", label: "Remote Repository", cmd: "git push" },
  ];

  const captions = [
    "You edited app.js. It sits in your working directory, untracked by the next commit.",
    "git add moved the change into the staging area, ready to be committed.",
    "git commit recorded a snapshot in your local repository. It is yours alone for now.",
    "git push uploaded the commit to the remote. Now your teammates can see it.",
  ];

  let stage = $state(0);
</script>

<GitDemo caption={captions[stage]} step={stage} count={captions.length}>
  {#snippet controls()}
    <TimelineControls
      count={4}
      bind:step={stage}
      interval={1800}
      labels={["", "git add", "git commit", "git push"]}
    />
  {/snippet}

  <div class="flow">
    {#each areas as area, i}
      <div class="flow__col" class:flow__col--active={i === stage}>
        <div class="flow__title">{area.label}</div>
        <div class="flow__slot">
          {#if i === stage}
            {#if stage < 2}
              <div class="card card--file" in:receive={{ key: "item" }} out:send={{ key: "item" }}>
                <span class="card__icon">📄</span> app.js
              </div>
            {:else}
              <div class="card card--commit" in:receive={{ key: "item" }} out:send={{ key: "item" }}>
                <span class="card__dot"></span> a1b2c3d
              </div>
            {/if}
          {/if}
        </div>
      </div>
    {/each}
  </div>
</GitDemo>

<style>
  .flow {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.5rem;
    width: 100%;
  }
  .flow__col {
    border: 1px dashed var(--sl-color-gray-5);
    border-radius: 0.5rem;
    padding: 0.5rem;
    min-height: 6.5rem;
    display: flex;
    flex-direction: column;
    transition:
      border-color 0.3s ease,
      background 0.3s ease;
  }
  .flow__col--active {
    border-color: var(--git-orange);
    border-style: solid;
    background: color-mix(in srgb, var(--git-orange) 8%, transparent);
  }
  .flow__title {
    font-size: 0.72rem;
    font-weight: 600;
    color: var(--sl-color-gray-3);
    text-align: center;
    margin-bottom: 0.5rem;
    line-height: 1.2;
  }
  .flow__slot {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .card {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.4rem 0.6rem;
    border-radius: 0.5rem;
    font-size: 0.8rem;
    font-family: var(--__sl-font-mono, monospace);
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);
  }
  .card--file {
    background: var(--git-orange);
    color: #fff;
  }
  .card--commit {
    background: var(--sl-color-gray-6);
    color: var(--sl-color-white);
    border: 1px solid var(--git-orange);
  }
  .card__dot {
    width: 0.65rem;
    height: 0.65rem;
    border-radius: 50%;
    background: var(--git-orange);
  }
  @media (max-width: 520px) {
    .flow {
      grid-template-columns: 1fr 1fr;
    }
  }
</style>
