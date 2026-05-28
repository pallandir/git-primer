<script>
  import { onMount } from "svelte";
  import { SvelteFlow, Background, BackgroundVariant } from "@xyflow/svelte";
  import "@xyflow/svelte/dist/style.css";
  import GitDemo from "./GitDemo.svelte";
  import CommitBlock from "./flow/CommitBlock.svelte";

  const nodeTypes = { commit: CommitBlock };
  const GENESIS = "0000000";

  const initial = [
    { tree: "tree·9f3a1", author: "amy", message: "Initial commit" },
    { tree: "tree·7c2b8", author: "amy", message: "Add README" },
    { tree: "tree·4e8d0", author: "sam", message: "Build login form" },
  ];

  let chain = $state(structuredClone(initial));
  let hashes = $state([]);
  let nodes = $state.raw([]);
  let edges = $state.raw([]);
  let ready = $state(false);
  let colorMode = $state("dark");
  let caption = $state(
    "Each block stores its parent's hash. Edit any message and watch every later hash change.",
  );

  async function sha1short(input) {
    const buf = await crypto.subtle.digest(
      "SHA-1",
      new TextEncoder().encode(input),
    );
    return [...new Uint8Array(buf)]
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
      .slice(0, 7);
  }

  function content(i, parentHash) {
    return `${parentHash}\n${chain[i].tree}\n${chain[i].author}\n${chain[i].message}`;
  }

  async function computeHashes() {
    const out = [];
    let parent = GENESIS;
    for (let i = 0; i < chain.length; i++) {
      const h = await sha1short(content(i, parent));
      out.push(h);
      parent = h;
    }
    return out;
  }

  function buildNodes(flashSet = new Set()) {
    nodes = chain.map((c, i) => ({
      id: String(i),
      type: "commit",
      position: { x: i * 262, y: 0 },
      draggable: false,
      selectable: false,
      data: {
        ...c,
        index: i,
        hash: hashes[i],
        parentHash: i === 0 ? GENESIS : hashes[i - 1],
        genesis: i === 0,
        flash: flashSet.has(i),
        onEdit,
      },
    }));
    edges = chain.slice(1).map((_, idx) => {
      const i = idx + 1;
      return {
        id: `e${i}`,
        source: String(i - 1),
        target: String(i),
        animated: flashSet.has(i),
        label: "parent",
        type: "smoothstep",
      };
    });
  }

  function clearFlash() {
    setTimeout(() => buildNodes(new Set()), 900);
  }

  async function recompute(changedFrom = 0) {
    const old = [...hashes];
    hashes = await computeHashes();
    const flashSet = new Set();
    for (let i = 0; i < hashes.length; i++) {
      if (i >= changedFrom || old[i] !== hashes[i]) flashSet.add(i);
    }
    buildNodes(flashSet);
    clearFlash();
    return flashSet;
  }

  async function onEdit(index, value) {
    chain[index].message = value;
    const flashed = await recompute(index);
    const n = flashed.size;
    caption =
      n > 1
        ? `You changed commit #${index}, so its hash changed, which changed its child's "parent", and so on. ${n} blocks were rewritten.`
        : `Commit #${index} re-hashed. It is the tip, so nothing downstream depends on it yet.`;
  }

  let treeCounter = 0;
  function randTree() {
    const hex = (Math.floor(Math.random() * 0xfffff) + 0x10000).toString(16);
    return `tree·${hex.slice(0, 5)}`;
  }

  async function addCommit() {
    chain.push({
      tree: randTree(),
      author: "you",
      message: `New changes (${++treeCounter})`,
    });
    await recompute(chain.length - 1);
    caption = `git commit appended block #${chain.length - 1}. Its "parent" is the previous tip's hash, linking it to the whole chain.`;
  }

  async function tamper() {
    chain[0].message = "Initial commit 😈 (edited)";
    const flashed = await recompute(0);
    caption = `Tampering with the very first commit forced all ${flashed.size} blocks to re-hash. In a shared repo everyone would instantly notice the mismatch. That is Git's integrity guarantee.`;
  }

  async function reset() {
    chain = structuredClone(initial);
    treeCounter = 0;
    await recompute(0);
    caption =
      "Each block stores its parent's hash. Edit any message and watch every later hash change.";
  }

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
    computeHashes().then((h) => {
      hashes = h;
      buildNodes();
      ready = true;
    });
    return () => obs.disconnect();
  });
</script>

<GitDemo {caption}>
  {#snippet controls()}
    <div class="gd__choices">
      <button class="git-demo__btn git-demo__btn--primary" onclick={addCommit}>
        git commit ▸
      </button>
      <button class="git-demo__btn" onclick={tamper}>Tamper with commit #0</button>
      <button class="git-demo__btn" onclick={reset}>Reset chain</button>
      <span class="gd__hint">A commit = a block. hash(content + parent's hash)</span>
    </div>
  {/snippet}

  <div class="chain">
    {#if ready}
      <SvelteFlow
        bind:nodes
        bind:edges
        {nodeTypes}
        {colorMode}
        fitView
        fitViewOptions={{ padding: 0.12 }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        zoomOnScroll={false}
        zoomOnDoubleClick={false}
        panOnScroll={false}
        panOnDrag={true}
        minZoom={0.4}
        maxZoom={1.4}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
      </SvelteFlow>
    {:else}
      <p class="chain__loading">Loading chain…</p>
    {/if}
  </div>
</GitDemo>

<style>
  .chain {
    height: 340px;
    border: 1px solid var(--sl-color-gray-5);
    border-radius: 0.6rem;
    overflow: hidden;
    background: var(--sl-color-black);
  }
  .chain__loading {
    display: grid;
    place-items: center;
    height: 100%;
    margin: 0;
    color: var(--sl-color-gray-3);
  }
  .chain :global(.svelte-flow) {
    background: var(--sl-color-black);
  }
  .chain :global(.svelte-flow__edge-path) {
    stroke: var(--git-orange);
    stroke-width: 2;
  }
  .chain :global(.svelte-flow__edge.animated .svelte-flow__edge-path) {
    stroke: #ff5a3c;
  }
  .chain :global(.svelte-flow__edge-text) {
    fill: var(--sl-color-gray-3);
    font-size: 10px;
  }
  .chain :global(.svelte-flow__edge-textbg) {
    fill: var(--sl-color-black);
  }
</style>
