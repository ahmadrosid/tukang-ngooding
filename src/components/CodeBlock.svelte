<script lang="ts">
  import Copy from 'lucide-svelte/icons/copy';
  import Play from 'lucide-svelte/icons/play';
  import { codeStore, updateCode, type CodeStoreType } from "$lib/code-store";

  let pre: HTMLPreElement;
  let showCopied = false;

  function copyToClipboard() {
    if (pre) {
      navigator.clipboard.writeText(pre.textContent || "");
      showCopied = true;
      setTimeout(() => (showCopied = false), 2000);
    }
  }

  function applyCode() {
    if (pre) {
      const codeContent = pre.textContent || "";
      updateCode({ ...($codeStore), code: codeContent });
      console.log("Code applied:", codeContent);
    }
  }
</script>

<div class="p-0 bg-neutral-900 rounded-lg overflow-hidden font-mono">
  <div
    class="flex justify-between items-center px-4 py-2 bg-neutral-700/75 text-neutral-400"
  >
    <div></div>
    <div class="flex items-center space-x-2">
      <button
        on:click={applyCode}
        class="text-xs px-2 py-1 rounded hover:bg-neutral-700 transition-colors duration-200 flex items-center"
      >
        <Play size={14} class="mr-1" />
        Apply
      </button>
      <button
        on:click={copyToClipboard}
        class="text-xs px-2 py-1 rounded hover:bg-neutral-700 transition-colors duration-200 flex items-center"
      >
        {#if showCopied}
          <span class="text-neutral-400">Copied!</span>
        {:else}
          <Copy size={14} class="mr-1" />
          Copy
        {/if}
      </button>
    </div>
  </div>
  <pre class="my-0" bind:this={pre}><slot /></pre>
</div>
