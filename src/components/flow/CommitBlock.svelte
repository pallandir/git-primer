<script>
  import { Handle, Position } from "@xyflow/svelte";

  let { data } = $props();
</script>

<div
  class="block"
  class:block--flash={data.flash}
  class:block--genesis={data.genesis}
>
  <Handle type="target" position={Position.Left} />

  <div class="block__top">
    <span class="block__tag">block #{data.index}</span>
    <span class="block__hash" title="this commit's SHA">{data.hash}</span>
  </div>

  <div class="block__rows">
    <div class="row">
      <span class="row__key">parent</span>
      <code class="row__val row__val--link" class:row__val--zero={data.genesis}>
        {data.parentHash}
      </code>
    </div>
    <div class="row">
      <span class="row__key">tree</span>
      <code class="row__val">{data.tree}</code>
    </div>
    <div class="row">
      <span class="row__key">author</span>
      <code class="row__val">{data.author}</code>
    </div>
    <label class="row row--msg">
      <span class="row__key">message</span>
      <input
        class="nodrag row__input"
        value={data.message}
        oninput={(e) => data.onEdit(data.index, e.currentTarget.value)}
        aria-label={`Commit ${data.index} message`}
      />
    </label>
  </div>

  <Handle type="source" position={Position.Right} />
</div>

<style>
  .block {
    width: 210px;
    border: 1px solid var(--sl-color-gray-5);
    border-radius: 0.7rem;
    background: var(--sl-color-bg, #16120f);
    box-shadow: 0 8px 22px -14px rgba(0, 0, 0, 0.8);
    overflow: hidden;
    font-family: var(--__sl-font-mono, monospace);
  }
  .block--genesis {
    border-style: dashed;
  }
  .block--flash {
    animation: rehash 0.85s ease;
  }
  @keyframes rehash {
    0% {
      border-color: var(--sl-color-gray-5);
      box-shadow: 0 8px 22px -14px rgba(0, 0, 0, 0.8);
    }
    25% {
      border-color: #ff5a3c;
      box-shadow: 0 0 0 3px color-mix(in srgb, #ff5a3c 45%, transparent);
      transform: translateY(-3px);
    }
    100% {
      border-color: var(--sl-color-gray-5);
      box-shadow: 0 8px 22px -14px rgba(0, 0, 0, 0.8);
      transform: translateY(0);
    }
  }
  .block__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.45rem 0.6rem;
    background: linear-gradient(
      120deg,
      color-mix(in srgb, var(--git-orange) 22%, transparent),
      transparent
    );
    border-bottom: 1px solid var(--sl-color-gray-5);
  }
  .block__tag {
    font-size: 0.62rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--sl-color-gray-3);
  }
  .block__hash {
    font-size: 0.85rem;
    font-weight: 700;
    color: var(--git-orange);
  }
  .block__rows {
    padding: 0.5rem 0.6rem;
    display: flex;
    flex-direction: column;
    gap: 0.32rem;
  }
  .row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.72rem;
  }
  .row__key {
    width: 3.6rem;
    flex: none;
    color: var(--sl-color-gray-3);
  }
  .row__val {
    color: var(--sl-color-white);
    background: var(--sl-color-gray-6);
    padding: 0.05rem 0.35rem;
    border-radius: 0.3rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .row__val--link {
    color: #4aa3ff;
  }
  .row__val--zero {
    color: var(--sl-color-gray-4);
  }
  .row--msg {
    margin-top: 0.1rem;
  }
  .row__input {
    flex: 1;
    min-width: 0;
    font: inherit;
    font-size: 0.72rem;
    color: var(--sl-color-white);
    background: var(--sl-color-gray-6);
    border: 1px solid transparent;
    border-radius: 0.3rem;
    padding: 0.15rem 0.35rem;
    transition: border-color 0.15s ease;
  }
  .row__input:focus {
    outline: none;
    border-color: var(--git-orange);
  }
</style>
