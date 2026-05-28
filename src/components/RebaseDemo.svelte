<script>
  import GitDemo from "./GitDemo.svelte";
  import TimelineControls from "./TimelineControls.svelte";
  import CommitGraph from "./CommitGraph.svelte";
  import { colX, laneY, stackLevels } from "./flow/graph.js";

  const captions = [
    "feature branched off B. Meanwhile main moved on to C. The two lines have diverged.",
    "git rebase main replayed D and E on top of C as brand new commits (D', E'). History is now linear, as if feature had started from the latest main.",
  ];

  const labels = ["Diverged history", "Rebase onto main"];

  let step = $state(0);
  let rebased = $derived(step >= 1);

  let nodes = $derived([
    { id: "A", x: colX(0), y: laneY("main"), variant: "main" },
    { id: "B", x: colX(1), y: laneY("main"), variant: "main" },
    { id: "C", x: colX(2), y: laneY("main"), variant: "main" },
    {
      id: "D",
      x: rebased ? colX(3) : colX(2),
      y: rebased ? laneY("main") : laneY("feature"),
      variant: "feature",
      label: rebased ? "D'" : "D",
    },
    {
      id: "E",
      x: rebased ? colX(4) : colX(3),
      y: rebased ? laneY("main") : laneY("feature"),
      variant: "feature",
      label: rebased ? "E'" : "E",
    },
  ]);

  let edges = $derived(
    [
      { id: "eAB", from: "A", to: "B", variant: "main" },
      { id: "eBC", from: "B", to: "C", variant: "main" },
      rebased
        ? { id: "eCD1", from: "C", to: "D", variant: "feature" }
        : { id: "eBD0", from: "B", to: "D", variant: "feature" },
      rebased
        ? { id: "eDE1", from: "D", to: "E", variant: "feature" }
        : { id: "eDE0", from: "D", to: "E", variant: "feature" },
    ],
  );

  let pointers = $derived(
    stackLevels([
      { key: "main", label: "main", at: "C", variant: "branch" },
      { key: "feature", label: "feature", at: "E", variant: "feature" },
    ]),
  );
</script>

<GitDemo caption={captions[step]} {step} count={captions.length}>
  {#snippet controls()}
    <TimelineControls count={captions.length} bind:step interval={2200} {labels} />
  {/snippet}

  <CommitGraph {nodes} {edges} {pointers} label="git rebase replaying commits onto main" />
</GitDemo>
