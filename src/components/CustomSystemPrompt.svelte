<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let systemPrompt: string = "";
  const dispatch = createEventDispatcher<{ update: string }>();

  let dialogOpen = false;
  let tempSystemPrompt = systemPrompt;

  function openDialog() {
    tempSystemPrompt = systemPrompt;
    dialogOpen = true;
  }

  function handleUpdate() {
    systemPrompt = tempSystemPrompt;
    dispatch("update", systemPrompt);
    dialogOpen = false;
  }
</script>

<button
  on:click={openDialog}
  class="w-full px-4 py-2 bg-transparent text-white rounded focus:outline-none text-sm flex items-center"
>
  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
  <span>Set system prompt</span>
</button>

{#if dialogOpen}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-neutral-800 p-6 rounded-lg w-full max-w-xl">
      <h2 class="text-lg font-semibold text-white mb-4">System Prompt</h2>
      <p class="text-xs text-neutral-300 mb-4">
        Enter your custom system prompt here. Click save when you're done.
      </p>
      <textarea
        bind:value={tempSystemPrompt}
        placeholder="Enter your custom system prompt here..."
        rows={5}
        class="w-full p-2 bg-neutral-700 rounded text-white text-sm focus:outline-none resize-none scrollbar-hide mb-4"
      />
      <div class="flex justify-end space-x-2">
        <button
          on:click={() => (dialogOpen = false)}
          class="px-4 py-2 bg-neutral-700 text-white rounded hover:bg-neutral-600 focus:outline-none text-sm"
        >
          Cancel
        </button>
        <button
          on:click={handleUpdate}
          class="px-4 py-2 bg-orange-800 text-white rounded hover:bg-orange-700 focus:outline-none text-sm"
        >
          Save
        </button>
      </div>
    </div>
  </div>
{/if}
