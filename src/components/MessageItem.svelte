<script lang="ts">
  import 'highlight.js/styles/github-dark.css';

  import Markdown, { type Plugin } from "svelte-exmarkdown";
  import { gfmPlugin } from "svelte-exmarkdown/gfm";
  import typescript from "highlight.js/lib/languages/typescript";
  import rehypeHighlight from "rehype-highlight";
  const plugins: Plugin[] = [
    gfmPlugin(),
    {
      rehypePlugin: [
        rehypeHighlight,
        { ignoreMissing: true, languages: { typescript } },
      ],
    },
  ];

  export let message;
</script>

<div>
  <div class="gap-4 flex">
    <div
      class="bg-neutral-800 border border-neutral-700/20 rounded-2xl flex p-4 gap-3 shadow-sm"
    >
      {#if message.role === "user"}
        <div>
          <span class="p-1.5 text-sm rounded-full bg-purple-500"> ME </span>
        </div>
      {/if}
      <div class="space-y-4">
        <Markdown md={message.content} {plugins} />
      </div>
    </div>
  </div>
</div>
