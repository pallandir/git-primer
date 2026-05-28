<script>
  import { onMount, onDestroy } from "svelte";

  const W = 700;
  const H = 300;
  const MAIN_Y = 120;
  const FEAT_Y = 215;

  const nodes = [
    { id: "c1", x: 90, y: MAIN_Y, lane: "main" },
    { id: "c2", x: 190, y: MAIN_Y, lane: "main" },
    { id: "c3", x: 300, y: FEAT_Y, lane: "feat" },
    { id: "c4", x: 400, y: FEAT_Y, lane: "feat" },
    { id: "m", x: 510, y: MAIN_Y, lane: "main", merge: true },
    { id: "c5", x: 620, y: MAIN_Y, lane: "main" },
  ];

  const edges = [
    { id: "e1", d: `M90,${MAIN_Y} L190,${MAIN_Y}`, lane: "main" },
    { id: "e2", d: `M190,${MAIN_Y} C245,${MAIN_Y} 250,${FEAT_Y} 300,${FEAT_Y}`, lane: "feat" },
    { id: "e3", d: `M300,${FEAT_Y} L400,${FEAT_Y}`, lane: "feat" },
    { id: "e4", d: `M190,${MAIN_Y} L510,${MAIN_Y}`, lane: "main" },
    { id: "e5", d: `M400,${FEAT_Y} C460,${FEAT_Y} 465,${MAIN_Y} 510,${MAIN_Y}`, lane: "feat" },
    { id: "e6", d: `M510,${MAIN_Y} L620,${MAIN_Y}`, lane: "main" },
  ];

  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const headFor = (id) => ({ x: byId[id].x - 28, y: byId[id].y - 74 });

  let root;
  let tl;

  onMount(async () => {
    const { createTimeline, utils } = await import("animejs");

    const node = (id) => root.querySelector(`[data-node="${id}"]`);
    const edge = (id) => root.querySelector(`[data-edge="${id}"]`);
    const head = root.querySelector("[data-head]");

    for (const e of edges) {
      const el = edge(e.id);
      const len = el.getTotalLength();
      el.style.strokeDasharray = len;
      el.style.strokeDashoffset = len;
      el.dataset.len = len;
    }
    utils.set(
      nodes.map((n) => node(n.id)),
      { opacity: 0, scale: 0 },
    );
    utils.set(head, { opacity: 0 });
    const start = headFor("c1");
    utils.set(head, { translateX: start.x, translateY: start.y });

    const pop = { duration: 460, ease: "outBack" };
    const draw = { duration: 420, ease: "inOutSine" };
    const move = { duration: 520, ease: "inOutQuad" };

    tl = createTimeline({
      loop: true,
      defaults: { ease: "outCubic" },
    });

    tl.add(node("c1"), { opacity: [0, 1], scale: [0, 1], ...pop })
      .add(head, { opacity: [0, 1], duration: 250 }, "-=200")
      .add(edge("e1"), { strokeDashoffset: [+edge("e1").dataset.len, 0], ...draw }, "+=120")
      .add(node("c2"), { opacity: [0, 1], scale: [0, 1], ...pop }, "-=120")
      .add(head, { translateX: headFor("c2").x, translateY: headFor("c2").y, ...move }, "-=300")
      .add(edge("e2"), { strokeDashoffset: [+edge("e2").dataset.len, 0], ...draw }, "+=160")
      .add(node("c3"), { opacity: [0, 1], scale: [0, 1], ...pop }, "-=120")
      .add(head, { translateX: headFor("c3").x, translateY: headFor("c3").y, ...move }, "-=320")
      .add(edge("e3"), { strokeDashoffset: [+edge("e3").dataset.len, 0], ...draw }, "+=120")
      .add(node("c4"), { opacity: [0, 1], scale: [0, 1], ...pop }, "-=120")
      .add(head, { translateX: headFor("c4").x, translateY: headFor("c4").y, ...move }, "-=320")
      .add(edge("e4"), { strokeDashoffset: [+edge("e4").dataset.len, 0], duration: 520, ease: "inOutSine" }, "+=160")
      .add(edge("e5"), { strokeDashoffset: [+edge("e5").dataset.len, 0], ...draw }, "-=420")
      .add(node("m"), { opacity: [0, 1], scale: [0, 1], ...pop }, "-=120")
      .add(head, { translateX: headFor("m").x, translateY: headFor("m").y, ...move }, "-=320")
      .add(edge("e6"), { strokeDashoffset: [+edge("e6").dataset.len, 0], ...draw }, "+=120")
      .add(node("c5"), { opacity: [0, 1], scale: [0, 1], ...pop }, "-=120")
      .add(head, { translateX: headFor("c5").x, translateY: headFor("c5").y, ...move }, "-=320")
      .add({}, { duration: 1400 })
      .add(
        [...nodes.map((n) => node(n.id)), ...edges.map((e) => edge(e.id)), head],
        { opacity: 0, duration: 500, ease: "inOutSine" },
        "+=200",
      );
  });

  onDestroy(() => {
    if (tl) tl.pause();
  });
</script>

<div class="herograph" bind:this={root} aria-hidden="true">
  <svg viewBox="0 0 {W} {H}" preserveAspectRatio="xMidYMid meet">
    <text x="20" y={MAIN_Y - 30} class="lane-label main">main</text>
    <text x="248" y={FEAT_Y + 40} class="lane-label feat">feature</text>

    {#each edges as e}
      <path
        data-edge={e.id}
        d={e.d}
        class="edge {e.lane === 'feat' ? 'edge--feat' : 'edge--main'}"
        fill="none"
      />
    {/each}

    {#each nodes as n}
      <g data-node={n.id} class="node">
        <circle
          cx={n.x}
          cy={n.y}
          r="15"
          class={n.merge ? "dot dot--merge" : n.lane === "main" ? "dot dot--main" : "dot dot--feat"}
        />
        <text x={n.x} y={n.y + 4} class="dot-label">{n.id}</text>
      </g>
    {/each}

    <g data-head>
      <rect width="56" height="24" rx="6" class="head-badge" />
      <text x="28" y="16" class="head-text">HEAD</text>
      <path d="M28,24 L22,32 L34,32 Z" class="head-arrow" />
    </g>
  </svg>
</div>

<style>
  .herograph {
    width: 100%;
    height: 100%;
  }
  .herograph svg {
    width: 100%;
    height: 100%;
    overflow: visible;
  }
  .lane-label {
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.04em;
    font-family: var(--__sl-font-mono, monospace);
  }
  .lane-label.main {
    fill: var(--git-orange);
  }
  .lane-label.feat {
    fill: #4aa3ff;
  }
  .edge {
    stroke-width: 3.5;
    stroke-linecap: round;
  }
  .edge--main {
    stroke: var(--git-orange);
  }
  .edge--feat {
    stroke: #4aa3ff;
  }
  .node {
    transform-box: fill-box;
    transform-origin: center;
  }
  .dot {
    stroke-width: 3;
  }
  .dot--main {
    fill: var(--git-orange);
    stroke: color-mix(in srgb, var(--git-orange) 40%, #000);
  }
  .dot--feat {
    fill: #4aa3ff;
    stroke: #1f6fbf;
  }
  .dot--merge {
    fill: var(--sl-color-bg, #14110f);
    stroke: var(--git-orange);
  }
  .dot-label {
    font-size: 11px;
    font-weight: 700;
    fill: #fff;
    text-anchor: middle;
    font-family: var(--__sl-font-mono, monospace);
    pointer-events: none;
  }
  .dot--merge + .dot-label {
    fill: var(--git-orange);
  }
  .head-badge {
    fill: var(--sl-color-white, #fff);
    stroke: var(--git-orange);
    stroke-width: 2;
  }
  .head-text {
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.05em;
    fill: var(--git-orange);
    text-anchor: middle;
    font-family: var(--__sl-font-mono, monospace);
  }
  .head-arrow {
    fill: var(--git-orange);
  }
  @media (prefers-reduced-motion: reduce) {
    .herograph :global(*) {
      animation: none !important;
    }
  }
</style>
