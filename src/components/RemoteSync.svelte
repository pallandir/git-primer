<script>
  import GitDemo from "./GitDemo.svelte";
  import TimelineControls from "./TimelineControls.svelte";
  import CommitGraph from "./CommitGraph.svelte";
  import { colX, laneY, stackLevels, DUR, EASE } from "./flow/graph.js";

  // Each step is a full snapshot of both repositories, so scrubbing backwards
  // and forwards always lands on a valid, consistent state.
  const steps = [
    {
      tag: "in sync",
      local: ["C1", "C2"],
      localMain: "C2",
      localOrigin: "C2",
      remote: ["C1", "C2"],
      remoteMain: "C2",
      fly: null,
      caption:
        "You and the remote agree: both are at C2. main and origin/main point to the same commit.",
    },
    {
      tag: "git commit",
      local: ["C1", "C2", "C3"],
      localMain: "C3",
      localOrigin: "C2",
      remote: ["C1", "C2"],
      remoteMain: "C2",
      fly: null,
      caption:
        "git commit: you record C3 locally. main moves to C3, but origin/main stays at C2. You are one commit ahead of the remote.",
    },
    {
      tag: "git push",
      local: ["C1", "C2", "C3"],
      localMain: "C3",
      localOrigin: "C3",
      remote: ["C1", "C2", "C3"],
      remoteMain: "C3",
      fly: { dir: "push", id: "C3" },
      caption:
        "git push: C3 is uploaded to the remote. origin/main catches up to C3. Now your teammates can see your work.",
    },
    {
      tag: "teammate pushes",
      local: ["C1", "C2", "C3"],
      localMain: "C3",
      localOrigin: "C3",
      remote: ["C1", "C2", "C3", "C4"],
      remoteMain: "C4",
      fly: null,
      caption:
        "Meanwhile a teammate pushes C4. The remote is now ahead of you, but your local repo has no idea yet.",
    },
    {
      tag: "git fetch",
      local: ["C1", "C2", "C3", "C4"],
      localMain: "C3",
      localOrigin: "C4",
      remote: ["C1", "C2", "C3", "C4"],
      remoteMain: "C4",
      fly: { dir: "fetch", id: "C4" },
      caption:
        "git fetch: C4 is downloaded and origin/main moves to C4. Notice main is STILL at C3. Fetch never touches your branch or your files, it just updates your view of the remote.",
    },
    {
      tag: "git pull",
      local: ["C1", "C2", "C3", "C4"],
      localMain: "C4",
      localOrigin: "C4",
      remote: ["C1", "C2", "C3", "C4"],
      remoteMain: "C4",
      fly: null,
      caption:
        "git pull = fetch + merge. main fast-forwards to C4. You are back in sync, and you never had to leave your branch to do it.",
    },
  ];

  let step = $state(0);
  let cur = $derived(steps[step]);

  let stage;
  let localEl;
  let remoteEl;
  let token = $state({ on: false, id: "", x: 0, y: 0 });
  let flying = $state(false);

  function panelGraph(commits, tip, lane = "main") {
    const tipIdx = commits.indexOf(tip);
    const nodes = commits.map((id, i) => ({
      id,
      x: colX(i),
      y: laneY(lane),
      variant: "main",
      ghost: i > tipIdx,
    }));
    const edges = commits.slice(1).map((id, i) => ({
      id: `e${i}`,
      from: commits[i],
      to: id,
      variant: "main",
      ghost: i + 1 > tipIdx,
    }));
    return { nodes, edges };
  }

  let localG = $derived(panelGraph(cur.local, cur.localMain));
  let remoteG = $derived(panelGraph(cur.remote, cur.remoteMain));

  let localPtrs = $derived(
    stackLevels([
      { key: "main", label: "main", at: cur.localMain, variant: "branch" },
      { key: "origin", label: "origin/main", at: cur.localOrigin, variant: "origin" },
    ]),
  );
  let remotePtrs = $derived([
    { key: "rmain", label: "main", at: cur.remoteMain, variant: "branch" },
  ]);

  async function flyToken(dir, id) {
    if (!stage || !localEl || !remoteEl) return;
    const fromEl = (dir === "push" ? localEl : remoteEl).querySelector(`[data-node="${id}"]`);
    const toEl = (dir === "push" ? remoteEl : localEl).querySelector(`[data-node="${id}"]`);
    if (!fromEl || !toEl) return;
    const sb = stage.getBoundingClientRect();
    const fb = fromEl.getBoundingClientRect();
    const tb = toEl.getBoundingClientRect();
    const start = { x: fb.left - sb.left + fb.width / 2, y: fb.top - sb.top + fb.height / 2 };
    const end = { x: tb.left - sb.left + tb.width / 2, y: tb.top - sb.top + tb.height / 2 };
    const { animate } = await import("animejs");
    const obj = { x: start.x, y: start.y };
    token = { on: true, id, x: start.x, y: start.y };
    flying = true;
    animate(obj, {
      x: end.x,
      y: end.y,
      duration: DUR.packet,
      ease: EASE.packet,
      onUpdate: () => (token = { on: true, id, x: obj.x, y: obj.y }),
      onComplete: () => {
        token = { on: false, id, x: end.x, y: end.y };
        flying = false;
      },
    });
  }

  let prev = -1;
  $effect(() => {
    const s = step;
    if (s > prev && steps[s].fly) {
      flyToken(steps[s].fly.dir, steps[s].fly.id);
    }
    prev = s;
  });
</script>

<GitDemo caption={cur.caption} {step} count={steps.length}>
  {#snippet controls()}
    <TimelineControls count={steps.length} bind:step interval={2400} labels={steps.map((s) => s.tag)} />
  {/snippet}

  <div class="rs" bind:this={stage}>
    <div class="rs__panel">
      <div class="rs__head"><span class="rs__icon">💻</span> Local repository</div>
      <div bind:this={localEl}>
        <CommitGraph
          nodes={localG.nodes}
          edges={localG.edges}
          pointers={localPtrs}
          width={360}
          height={150}
          label="Local repository commit graph"
        />
      </div>
    </div>

    <div class="rs__bridge" aria-hidden="true">
      <span class="rs__bridge-line" class:rs__bridge-line--active={flying}></span>
    </div>

    <div class="rs__panel">
      <div class="rs__head"><span class="rs__icon">☁️</span> Remote (origin)</div>
      <div bind:this={remoteEl}>
        <CommitGraph
          nodes={remoteG.nodes}
          edges={remoteG.edges}
          pointers={remotePtrs}
          width={360}
          height={150}
          label="Remote repository commit graph"
        />
      </div>
    </div>

    {#if token.on}
      <span class="rs__fly" style={`transform: translate(${token.x}px, ${token.y}px)`}>{token.id}</span>
    {/if}
  </div>
</GitDemo>

<style>
  .rs {
    position: relative;
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 0.5rem;
    align-items: center;
    width: 100%;
  }
  .rs__panel {
    border: 1px solid var(--sl-color-gray-5);
    border-radius: 0.6rem;
    background: color-mix(in srgb, var(--git-orange) 4%, var(--sl-color-black));
    padding: 0.65rem 0.5rem 0.3rem;
    min-width: 0;
  }
  .rs__head {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.78rem;
    font-weight: 600;
    color: var(--sl-color-gray-2);
    margin-bottom: 0.25rem;
  }
  .rs__icon {
    font-size: 1rem;
  }
  .rs__bridge {
    display: grid;
    place-items: center;
    width: 1.5rem;
  }
  .rs__bridge-line {
    width: 3px;
    height: 55%;
    background: repeating-linear-gradient(
      to bottom,
      var(--sl-color-gray-5) 0 6px,
      transparent 6px 12px
    );
    transition: background 0.25s ease;
  }
  .rs__bridge-line--active {
    background: repeating-linear-gradient(
      to bottom,
      var(--git-orange) 0 6px,
      transparent 6px 15px
    );
    filter: drop-shadow(0 0 4px color-mix(in srgb, var(--git-orange) 70%, transparent));
    animation: rs-march 0.7s linear infinite;
  }
  @keyframes rs-march {
    to {
      background-position-y: 21px;
    }
  }
  .rs__fly {
    position: absolute;
    top: 0;
    left: 0;
    margin: -1rem 0 0 -1rem;
    display: grid;
    place-items: center;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    background: #fff;
    color: var(--git-orange);
    font-size: 0.7rem;
    font-weight: 700;
    font-family: var(--__sl-font-mono, monospace);
    border: 3px solid var(--git-orange);
    box-shadow: 0 0 8px color-mix(in srgb, var(--git-orange) 85%, transparent);
    pointer-events: none;
    z-index: 5;
  }
  @media (max-width: 640px) {
    .rs {
      grid-template-columns: 1fr;
    }
    .rs__bridge {
      width: auto;
      height: 1.2rem;
    }
    .rs__bridge-line {
      width: 55%;
      height: 2px;
      background: repeating-linear-gradient(
        to right,
        var(--sl-color-gray-5) 0 6px,
        transparent 6px 12px
      );
    }
  }
</style>
