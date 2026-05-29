<script>
  import GitDemo from "./GitDemo.svelte";

  let content = $state("Hello, Git!\n");
  let hash = $state("");

  let bytes = $derived(new TextEncoder().encode(content).length);

  // Reproduce `git hash-object` exactly: Git hashes the object header
  // "blob <byte-length>\0" followed by the raw content, with SHA-1.
  async function compute(text) {
    const enc = new TextEncoder();
    const body = enc.encode(text);
    const header = enc.encode(`blob ${body.length}\0`);
    const full = new Uint8Array(header.length + body.length);
    full.set(header);
    full.set(body, header.length);
    const buf = await crypto.subtle.digest("SHA-1", full);
    return [...new Uint8Array(buf)]
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  $effect(() => {
    let alive = true;
    compute(content).then((h) => {
      if (alive) hash = h;
    });
    return () => (alive = false);
  });

  const caption =
    "Edit the content. The hash is computed live, and it matches what real Git would store, byte for byte.";
</script>

<GitDemo {caption}>
  <div class="ho">
    <div class="ho__io">
      <label class="ho__field">
        <span class="ho__key">content</span>
        <textarea class="ho__input" bind:value={content} rows="3" spellcheck="false"
          aria-label="Content to hash"></textarea>
      </label>

      <div class="ho__formula">
        <span class="ho__token ho__token--fn">SHA-1</span>
        <span class="ho__paren">(</span>
        <span class="ho__token ho__token--hdr">"blob {bytes}\0"</span>
        <span class="ho__plus">+</span>
        <span class="ho__token ho__token--body">content</span>
        <span class="ho__paren">)</span>
      </div>
    </div>

    <div class="ho__out">
      <span class="ho__key">object id (SHA-1)</span>
      <code class="ho__hash">
        <span class="ho__hash-short">{hash.slice(0, 7)}</span>{hash.slice(7)}
      </code>
      <p class="ho__note">
        The first <strong>7 characters</strong> are the short hash you usually see. Type the
        exact same content again, anywhere on earth, and you get the exact same id. That is how
        Git deduplicates files and detects corruption.
      </p>
    </div>
  </div>
</GitDemo>

<style>
  .ho {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.25rem;
    align-items: start;
  }
  .ho__io {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  .ho__field {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }
  .ho__key {
    font-size: 0.66rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: var(--sl-color-gray-3);
  }
  .ho__input {
    width: 100%;
    box-sizing: border-box;
    font-family: var(--__sl-font-mono, monospace);
    font-size: 0.85rem;
    line-height: 1.5;
    color: var(--sl-color-white);
    background: var(--sl-color-black);
    border: 1px solid var(--sl-color-gray-5);
    border-radius: 0.5rem;
    padding: 0.55rem 0.7rem;
    resize: vertical;
    transition: border-color 0.15s ease;
  }
  .ho__input:focus {
    outline: none;
    border-color: var(--git-orange);
  }
  .ho__formula {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.35rem;
    font-family: var(--__sl-font-mono, monospace);
    font-size: 0.82rem;
    padding: 0.5rem 0.65rem;
    border: 1px dashed var(--sl-color-gray-5);
    border-radius: 0.5rem;
  }
  .ho__token {
    padding: 0.1rem 0.4rem;
    border-radius: 0.35rem;
    font-weight: 600;
    white-space: nowrap;
  }
  .ho__token--fn {
    background: color-mix(in srgb, var(--git-orange) 22%, transparent);
    color: var(--git-orange);
  }
  .ho__token--hdr {
    background: color-mix(in srgb, var(--gp-feature) 18%, transparent);
    color: var(--gp-feature);
  }
  .ho__token--body {
    background: color-mix(in srgb, var(--gp-green) 18%, transparent);
    color: var(--gp-green);
  }
  .ho__paren,
  .ho__plus {
    color: var(--sl-color-gray-3);
    font-weight: 700;
  }
  .ho__out {
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
  }
  .ho__hash {
    font-family: var(--__sl-font-mono, monospace);
    font-size: 0.9rem;
    word-break: break-all;
    line-height: 1.5;
    background: var(--sl-color-gray-6);
    padding: 0.55rem 0.7rem;
    border-radius: 0.5rem;
    border: 1px solid var(--sl-color-gray-5);
  }
  .ho__hash-short {
    color: var(--git-orange);
    font-weight: 800;
  }
  .ho__note {
    margin: 0;
    font-size: 0.8rem;
    line-height: 1.5;
    color: var(--sl-color-gray-2);
  }
  @media (max-width: 640px) {
    .ho {
      grid-template-columns: 1fr;
    }
  }
</style>
