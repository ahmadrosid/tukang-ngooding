<script lang="ts">
  let pre: HTMLPreElement;
  let showCopied = false;

  function copyToClipboard() {
    if (pre) {
      navigator.clipboard.writeText(pre.textContent || "");
      showCopied = true;
      setTimeout(() => (showCopied = false), 2000);
    }
  }
</script>

<div class="p-0 bg-neutral-900 rounded-lg overflow-hidden font-mono">
    <div
    class="flex justify-between items-center px-4 py-2 bg-neutral-700 text-neutral-400 -mb-6"
  >
    <span class="text-xs"></span>
    <button
      on:click={copyToClipboard}
      class="text-xs px-2 py-1 rounded hover:bg-neutral-700 transition-colors duration-200"
    >
      {#if showCopied}
        <span class="text-neutral-400">Copied!</span>
      {:else}
        Copy
      {/if}
    </button>
  </div>
  <pre bind:this={pre} class="mx-4"><slot /></pre>
</div>
