<script>
  import GitDemo from "./GitDemo.svelte";
  import TimelineControls from "./TimelineControls.svelte";
  import CommitGraph from "./CommitGraph.svelte";
  import { colX, laneY, stackLevels } from "./flow/graph.js";

  const captions = [
    "main has two commits. This is our stable line of development.",
    "git switch -c feature creates a new branch pointing at the same commit. Nothing is copied.",
    "We commit on feature. main is untouched and stays safe.",
    "Another commit on feature. The two lines have now diverged.",
    "git merge feature joins the work back into main with a merge commit (M).",
  ];

  const labels = [
    "Two commits on main",
    "Create feature branch",
    "Commit on feature",
    "Commit on feature",
    "Merge into main",
  ];

  let step = $state(0);

  const N = {
    C1: { id: "C1", x: colX(0), y: laneY("main"), variant: "main" },
    C2: { id: "C2", x: colX(1), y: laneY("main"), variant: "main" },
    C3: { id: "C3", x: colX(2), y: laneY("feature"), variant: "feature" },
    C4: { id: "C4", x: colX(3), y: laneY("feature"), variant: "feature" },
    M: { id: "M", x: colX(4), y: laneY("main"), variant: "merge", label: "M" },
  };

  let nodes = $derived(
    [N.C1, N.C2, step >= 2 && N.C3, step >= 3 && N.C4, step >= 4 && N.M].filter(Boolean),
  );

  let edges = $derived(
    [
      { id: "e12", from: "C1", to: "C2", variant: "main" },
      step >= 2 && { id: "e23", from: "C2", to: "C3", variant: "feature" },
      step >= 3 && { id: "e34", from: "C3", to: "C4", variant: "feature" },
      step >= 4 && { id: "eMmain", from: "C2", to: "M", variant: "main" },
      step >= 4 && { id: "eMfeat", from: "C4", to: "M", variant: "feature" },
    ].filter(Boolean),
  );

  let pointers = $derived(
    stackLevels(
      [
        { key: "main", label: "main", at: step >= 4 ? "M" : "C2", variant: "branch" },
        step >= 1 && {
          key: "feature",
          label: "feature",
          at: step >= 3 ? "C4" : step >= 2 ? "C3" : "C2",
          variant: "feature",
        },
      ].filter(Boolean),
    ),
  );
</script>

<GitDemo caption={captions[step]} {step} count={captions.length}>
  {#snippet controls()}
    <TimelineControls count={captions.length} bind:step interval={1900} {labels} />
  {/snippet}

  <CommitGraph {nodes} {edges} {pointers} label="Branching and merging a feature into main" />
</GitDemo>
