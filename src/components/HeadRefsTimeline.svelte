<script>
  import GitDemo from "./GitDemo.svelte";
  import TimelineControls from "./TimelineControls.svelte";
  import CommitGraph from "./CommitGraph.svelte";
  import { colX, laneY, stackLevels } from "./flow/graph.js";

  const scenario = [
    {
      tag: "init",
      commits: ["C1"],
      mainTip: "C1",
      feat: null,
      head: { branch: "main" },
      caption:
        "A fresh repo. The branch main points to commit C1, and HEAD points to main. HEAD answers 'where am I right now?'.",
    },
    {
      tag: "git commit",
      commits: ["C1", "C2"],
      mainTip: "C2",
      feat: null,
      head: { branch: "main" },
      caption:
        "git commit creates C2, then moves the current branch (main) to it. Because HEAD points to main, HEAD rides along automatically.",
    },
    {
      tag: "switch -c feature",
      commits: ["C1", "C2"],
      mainTip: "C2",
      feat: "C2",
      head: { branch: "feature" },
      caption:
        "git switch -c feature creates a new pointer at C2 and moves HEAD onto it. No commit happened and nothing was copied, a branch is just a tiny movable pointer.",
    },
    {
      tag: "git commit",
      commits: ["C1", "C2", "C3"],
      mainTip: "C2",
      feat: "C3",
      head: { branch: "feature" },
      caption:
        "git commit on feature creates C3 and moves feature forward. main stays exactly where it was, at C2.",
    },
    {
      tag: "git switch main",
      commits: ["C1", "C2", "C3"],
      mainTip: "C2",
      feat: "C3",
      head: { branch: "main" },
      caption:
        "git switch main moves only HEAD, back onto main at C2. Your working files now match C2 again.",
    },
    {
      tag: "checkout C3",
      commits: ["C1", "C2", "C3"],
      mainTip: "C2",
      feat: "C3",
      head: { commit: "C3" },
      caption:
        "git checkout <C3-hash> points HEAD straight at a commit instead of a branch. This is a detached HEAD: new commits here would not belong to any branch.",
    },
    {
      tag: "switch main",
      commits: ["C1", "C2", "C3"],
      mainTip: "C2",
      feat: "C3",
      head: { branch: "main" },
      caption:
        "git switch main reattaches HEAD to a branch. Detached HEAD is not dangerous, it just means 'commit to a branch before you wander off if you want to keep the work'.",
    },
  ];

  let step = $state(0);
  let s = $derived(scenario[step]);

  const pos = {
    C1: { x: colX(0), y: laneY("main"), variant: "main" },
    C2: { x: colX(1), y: laneY("main"), variant: "main" },
    C3: { x: colX(2), y: laneY("feature"), variant: "feature" },
  };

  let nodes = $derived(s.commits.map((id) => ({ id, ...pos[id] })));

  let edges = $derived(
    [
      s.commits.includes("C2") && { id: "e12", from: "C1", to: "C2", variant: "main" },
      s.commits.includes("C3") && { id: "e23", from: "C2", to: "C3", variant: "feature" },
    ].filter(Boolean),
  );

  let pointers = $derived.by(() => {
    const list = [{ key: "main", label: "main", at: s.mainTip, variant: "branch" }];
    if (s.feat) list.push({ key: "feature", label: "feature", at: s.feat, variant: "feature" });
    if (s.head.commit) {
      list.push({ key: "head", label: "HEAD ⚠", at: s.head.commit, variant: "head", detached: true });
    } else {
      const at = s.head.branch === "feature" ? s.feat : s.mainTip;
      list.push({ key: "head", label: "HEAD", at, variant: "head" });
    }
    return stackLevels(list);
  });
</script>

<GitDemo caption={s.caption} {step} count={scenario.length}>
  {#snippet controls()}
    <TimelineControls
      count={scenario.length}
      bind:step
      interval={2600}
      labels={scenario.map((x) => x.tag)}
    />
  {/snippet}

  <CommitGraph
    {nodes}
    {edges}
    {pointers}
    label="HEAD and branch pointers moving through a commit history"
  />
</GitDemo>
