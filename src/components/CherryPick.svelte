<script>
  import GitDemo from "./GitDemo.svelte";
  import TimelineControls from "./TimelineControls.svelte";
  import CommitGraph from "./CommitGraph.svelte";
  import { colX, laneY, stackLevels } from "./flow/graph.js";

  const captions = [
    "A bug was fixed on the fix branch (commit X). We want only that single commit on main, not the whole branch.",
    "git cherry-pick copied just the bug-fix commit (X) onto main as a new commit (X'), with a new hash. The rest of the fix branch was left behind.",
  ];

  const labels = ["A fix branch with one wanted commit", "Cherry-pick X onto main"];

  let step = $state(0);
  let picked = $derived(step >= 1);

  let nodes = $derived(
    [
      { id: "A", x: colX(0), y: laneY("main"), variant: "main" },
      { id: "B", x: colX(1), y: laneY("main"), variant: "main" },
      { id: "C", x: colX(2), y: laneY("main"), variant: "main" },
      { id: "Y", x: colX(2), y: laneY("feature"), variant: "alt" },
      { id: "X", x: colX(3), y: laneY("feature"), variant: "pick", ghost: picked },
      picked && {
        id: "Xp",
        x: colX(3),
        y: laneY("main"),
        variant: "pick",
        label: "X'",
        enterFrom: { x: colX(3), y: laneY("feature") },
      },
    ].filter(Boolean),
  );

  let edges = $derived(
    [
      { id: "eAB", from: "A", to: "B", variant: "main" },
      { id: "eBC", from: "B", to: "C", variant: "main" },
      { id: "eBY", from: "B", to: "Y", variant: "alt" },
      { id: "eYX", from: "Y", to: "X", variant: "alt", ghost: picked },
      picked && { id: "eCXp", from: "C", to: "Xp", variant: "pick" },
    ].filter(Boolean),
  );

  let pointers = $derived(
    stackLevels([
      { key: "main", label: "main", at: picked ? "Xp" : "C", variant: "branch" },
      { key: "fix", label: "fix", at: "X", variant: "alt" },
    ]),
  );
</script>

<GitDemo caption={captions[step]} {step} count={captions.length}>
  {#snippet controls()}
    <TimelineControls count={captions.length} bind:step interval={2200} {labels} />
  {/snippet}

  <CommitGraph {nodes} {edges} {pointers} label="git cherry-pick a single commit onto main" />
</GitDemo>
