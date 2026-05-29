<script>
  import { onMount, untrack } from "svelte";
  import {
    SvelteFlow,
    Background,
    BackgroundVariant,
    Position,
  } from "@xyflow/svelte";
  import "@xyflow/svelte/dist/style.css";
  import TimelineControls from "./TimelineControls.svelte";
  import ZoneNode from "./flow/ZoneNode.svelte";
  import PacketEdge from "./flow/PacketEdge.svelte";

  const nodeTypes = { zone: ZoneNode };
  const edgeTypes = { packet: PacketEdge };

  const areas = [
    "Working Directory",
    "Staging Area",
    "Local Repository",
    "Remote Repository",
  ];
  const cmds = ["git add", "git commit", "git push"];

  const captions = [
    "You edited app.js. It sits in your working directory, untracked by the next commit.",
    "git add moved the change into the staging area, ready to be committed.",
    "git commit recorded a snapshot in your local repository. It is yours alone for now.",
    "git push uploaded the commit to the remote. Now your teammates can see it.",
  ];

  const ZONE_W = 210;
  const ZONE_H = 290;
  const ZONE_GAP = 124;

  let stage = $state(0);
  let prevStage = 0;
  let arrived = true;
  let colorMode = $state("dark");

  const payloadFor = (s) =>
    s < 2
      ? { kind: "file", icon: "📄", text: "app.js" }
      : { kind: "commit", text: "a1b2c3d" };

  const vis = $state({
    zones: [],
    activeEdge: -1,
    fire: [0, 0, 0],
    fireDir: "forward",
  });

  function updateZones() {
    vis.zones = areas.map((label, i) => ({
      active: i === stage,
      card: arrived && i === stage ? payloadFor(stage) : null,
    }));
  }

  function onArrive() {
    arrived = true;
    vis.activeEdge = -1;
    updateZones();
  }

  const initialNodes = areas.map((label, i) => ({
    id: `z${i}`,
    type: "zone",
    position: { x: i * (ZONE_W + ZONE_GAP), y: 0 },
    width: ZONE_W,
    height: ZONE_H,
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    draggable: false,
    selectable: false,
    data: { index: i, label, vis },
  }));

  const initialEdges = cmds.map((cmd, i) => ({
    id: `e${i}`,
    source: `z${i}`,
    target: `z${i + 1}`,
    type: "packet",
    data: { index: i, cmd, vis, onArrive },
  }));

  let nodes = $state.raw(initialNodes);
  let edges = $state.raw(initialEdges);

  updateZones();

  $effect(() => {
    const s = stage;
    untrack(() => {
      if (s === prevStage) return;
      if (s === prevStage + 1) {
        arrived = false;
        vis.fireDir = "forward";
        vis.activeEdge = prevStage;
        vis.fire[prevStage] += 1;
      } else {
        arrived = true;
        vis.activeEdge = -1;
      }
      prevStage = s;
      updateZones();
    });
  });

  onMount(() => {
    const sync = () =>
      (colorMode =
        document.documentElement.dataset.theme === "light" ? "light" : "dark");
    sync();
    const obs = new MutationObserver(sync);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => obs.disconnect();
  });
</script>

<div class="demo">
  <header class="demo__bar">
    <div class="demo__controls">
      <TimelineControls
        count={4}
        bind:step={stage}
        interval={2000}
        labels={["", "git add", "git commit", "git push"]}
      />
    </div>

    <div class="demo__caption">
      <span class="demo__step">Step {stage + 1} of {captions.length}</span>
      <p class="demo__caption-text">{captions[stage]}</p>
    </div>
  </header>

  <div class="demo__canvas">
    <SvelteFlow
      bind:nodes
      bind:edges
      {nodeTypes}
      {edgeTypes}
      {colorMode}
      fitView
      fitViewOptions={{ padding: 0.05 }}
      nodesDraggable={false}
      nodesConnectable={false}
      elementsSelectable={false}
      zoomOnScroll={false}
      zoomOnDoubleClick={false}
      panOnScroll={false}
      panOnDrag={false}
      proOptions={{ hideAttribution: true }}
    >
      <Background variant={BackgroundVariant.Dots} gap={22} size={1} />
    </SvelteFlow>
  </div>
</div>

<style>
  .demo {
    display: flex;
    flex-direction: column;
    height: 440px;
    margin: 1.75rem 0;
    border: 1px solid var(--sl-color-gray-5);
    border-radius: 0.85rem;
    overflow: hidden;
    background: var(--sl-color-black);
  }

  .demo__bar {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1.5rem;
    padding: 0.9rem 1.1rem;
    border-bottom: 1px solid var(--sl-color-gray-5);
  }

  .demo__controls {
    flex: 0 1 26rem;
    min-width: 0;
  }
  /* Compact variant of the shared TimelineControls for this header bar.
     The margin reset cancels Starlight's prose sibling spacing, which would
     otherwise push every button after the first down by 1rem. */
  .demo__controls :global(.tl) {
    --ctl-h: 2rem;
    gap: 0.55rem;
  }
  .demo__controls :global(.tl *) {
    margin: 0;
  }
  .demo__controls :global(.tl__btn) {
    font-size: 0.78rem;
    padding: 0 0.7rem;
  }

  .demo__caption {
    flex: 0 1 24rem;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    text-align: right;
  }
  .demo__step {
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--git-orange);
    font-variant-numeric: tabular-nums;
  }
  .demo__caption-text {
    margin: 0;
    font-size: 0.9rem;
    line-height: 1.45;
    color: var(--sl-color-gray-1);
  }

  .demo__canvas {
    flex: 1;
    min-height: 0;
    position: relative;
  }
  .demo__canvas :global(.svelte-flow) {
    background: var(--sl-color-black);
  }
  .demo__canvas :global(.svelte-flow__node) {
    cursor: default;
  }

  @media (max-width: 640px) {
    .demo {
      height: 540px;
    }
    .demo__bar {
      flex-direction: column;
      gap: 0.85rem;
    }
    .demo__caption {
      flex: none;
      text-align: left;
    }
  }
</style>
