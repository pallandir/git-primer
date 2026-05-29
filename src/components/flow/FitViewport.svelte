<script>
  import { useSvelteFlow } from "@xyflow/svelte";

  let { trigger, padding = 0.14, maxZoom = 1 } = $props();
  const { fitView } = useSvelteFlow();

  $effect(() => {
    trigger;
    requestAnimationFrame(() =>
      requestAnimationFrame(() => fitView({ padding, maxZoom, duration: 450 })),
    );
  });
</script>
