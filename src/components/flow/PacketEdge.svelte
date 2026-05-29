<script>
  import { onDestroy } from "svelte";
  import { getBezierPath, EdgeLabel } from "@xyflow/svelte";
  import { animate } from "animejs";

  let {
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    data,
  } = $props();

  const vis = data.vis;
  const index = data.index;

  let lineEl = $state();
  let packetEl = $state();
  let current = null;
  let seen = 0;

  let geometry = $derived(
    getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    }),
  );
  let edgePath = $derived(geometry[0]);
  let labelX = $derived(geometry[1]);
  let labelY = $derived(geometry[2]);
  let active = $derived(vis.activeEdge === index);
  let label = $derived(vis.edgeLabels?.[index] ?? data.cmd);

  function fly() {
    const line = lineEl;
    const packet = packetEl;
    if (!line || !packet) return;
    current?.pause();
    const length = line.getTotalLength();
    const reverse = vis.fireDir === "reverse";
    const progress = { t: reverse ? 1 : 0 };
    packet.style.opacity = "1";
    current = animate(progress, {
      t: reverse ? 0 : 1,
      duration: 650,
      ease: "inOutQuad",
      onUpdate: () => {
        if (!line.isConnected) return;
        const p = line.getPointAtLength(progress.t * length);
        packet.setAttribute("cx", p.x);
        packet.setAttribute("cy", p.y);
      },
      onComplete: () => {
        packet.style.opacity = "0";
        data.onArrive?.();
      },
    });
  }

  $effect(() => {
    const t = vis.fire[index] ?? 0;
    if (t > seen) {
      seen = t;
      fly();
    }
  });

  onDestroy(() => current?.pause());
</script>

<path
  bind:this={lineEl}
  d={edgePath}
  class="git-edge__line"
  class:git-edge__line--active={active}
  fill="none"
/>

{#if active}
  <path d={edgePath} class="git-edge__flow" fill="none" />
{/if}

<circle bind:this={packetEl} class="git-edge__packet" r="6" cx="0" cy="0" />

{#if label}
  <EdgeLabel x={labelX} y={labelY}>
    <span class="git-edge__cmd" class:git-edge__cmd--active={active}>
      {label}
    </span>
  </EdgeLabel>
{/if}

<style>
  .git-edge__line {
    stroke: var(--sl-color-gray-5);
    stroke-width: 2;
    transition: stroke 0.3s ease;
  }
  .git-edge__line--active {
    stroke: color-mix(in srgb, var(--git-orange) 55%, transparent);
  }
  .git-edge__flow {
    stroke: var(--git-orange);
    stroke-width: 2.5;
    stroke-linecap: round;
    stroke-dasharray: 6 9;
    animation: git-edge-march 0.7s linear infinite;
    filter: drop-shadow(0 0 4px color-mix(in srgb, var(--git-orange) 70%, transparent));
  }
  @keyframes git-edge-march {
    to {
      stroke-dashoffset: -30;
    }
  }
  .git-edge__packet {
    fill: #fff;
    stroke: var(--git-orange);
    stroke-width: 3;
    opacity: 0;
    filter: drop-shadow(0 0 6px color-mix(in srgb, var(--git-orange) 85%, transparent));
  }
  .git-edge__cmd {
    display: inline-block;
    padding: 0.18rem 0.5rem;
    border-radius: 0.4rem;
    font-family: var(--__sl-font-mono, monospace);
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--sl-color-gray-3);
    background: var(--sl-color-black);
    border: 1px solid var(--sl-color-gray-5);
    white-space: nowrap;
    transition:
      color 0.3s ease,
      border-color 0.3s ease;
  }
  .git-edge__cmd--active {
    color: #fff;
    border-color: var(--git-orange);
    background: var(--git-orange);
  }
</style>
