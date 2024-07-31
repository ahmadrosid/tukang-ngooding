<script lang="ts">
  import Markdown, { type Plugin } from "svelte-exmarkdown";
  import { gfmPlugin } from "svelte-exmarkdown/gfm";
  import { highlightPlugin } from "$lib/highlight-plugin";
  import CodeBlock from "./CodeBlock.svelte";
  const plugins: Plugin[] = [gfmPlugin(), highlightPlugin, { renderer: { code: CodeBlock } }];

  export let message;
</script>

<div>
  <div class="gap-4 flex font-sans">
    <div
      class="bg-neutral-800 border border-neutral-700/20 rounded-2xl flex items-center py-4 gap-3 shadow-sm"
    >
      <div class="px-4">
        {#if message.role === "user"}
          <p class="text-orange-500">You</p>
        {:else}
          <p class="text-purple-500">Tukang</p>
        {/if}
        <div
          class="mt-1 prose prose-sm prose-invert prose-pre:bg-neutral-900/75 prose-pre:rounded-md prose-pre:p-1 max-w-full"
        >
          <Markdown md={message.content} {plugins} />
        </div>
      </div>
    </div>
  </div>
</div>
