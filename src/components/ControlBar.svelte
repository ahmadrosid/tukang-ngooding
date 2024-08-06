<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import PlusIcon from "lucide-svelte/icons/plus";
  import Trash from "lucide-svelte/icons/trash-2";
  import { filePaths } from "$lib/file-path-store";

  const dispatch = createEventDispatcher<{ addFile: void; clearMessages: void }>();

  export let messageCount: number;

  let currentProvider: string = 'anthropic';

  onMount(() => {
    currentProvider = localStorage.getItem('llmProvider') || 'anthropic';
  });

  function handleAddFile() {
    dispatch("addFile");
  }

  function handleClearMessages() {
    dispatch("clearMessages");
  }
</script>

<div
  class="p-2 text-xs text-neutral-400 sticky top-0 bg-neutral-900 flex justify-between items-center"
>
  <div class="flex items-center gap-2">
    <button
      on:click={handleAddFile}
      class="text-xs bg-neutral-700/50 text-neutral-200 rounded px-2 py-1 transition-colors duration-300 ease-in-out hover:bg-neutral-600 focus:outline-none flex items-center"
    >
      <PlusIcon class="mr-1 size-3" />
      <span class="text-xs">Add file</span>
    </button>
    {#if $filePaths.length > 0}
      <span>Context files:</span>
      {#if $filePaths.length > 1}
        <button
          on:click={handleAddFile}
          class="font-semibold hover:underline cursor-pointer"
        >
          {$filePaths.length} files
        </button>
      {:else}
        {#each $filePaths as filePath}
          <span class="font-semibold ">{filePath}</span>
        {/each}
      {/if}
    {/if}
    <span class="ml-2">llm: {currentProvider}</span>
  </div>

  {#if messageCount > 1}
    <button
      on:click={handleClearMessages}
      class="text-xs text-neutral-400 rounded-lg px-2 py-1 transition-colors duration-300 ease-in-out hover:text-neutral-200 focus:outline-none flex items-center"
    >
      <Trash size={14} class="mr-1" />
      Clear messages
    </button>
  {/if}
</div>
