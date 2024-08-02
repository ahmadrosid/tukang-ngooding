<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import Settings from 'lucide-svelte/icons/settings';

  export let systemPrompt: string = "";
  const dispatch = createEventDispatcher<{ update: string }>();

  let dialogOpen = false;
  let tempSystemPrompt = systemPrompt;
  let textareaElement: HTMLTextAreaElement;

  function openDialog() {
    tempSystemPrompt = systemPrompt;
    dialogOpen = true;
  }

  function handleUpdate() {
    systemPrompt = tempSystemPrompt;
    dispatch("update", systemPrompt);
    dialogOpen = false;
  }

  function autoResize() {
    textareaElement.style.height = 'auto';
    textareaElement.style.height = Math.min(textareaElement.scrollHeight, 600) + 'px';
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && dialogOpen) {
      dialogOpen = false;
    }
  }

  onMount(() => {
    if (textareaElement) {
      autoResize();
    }

		window.addEventListener('keydown', handleKeydown);
		return () => {
			window.removeEventListener('keydown', handleKeydown);
		};
  });
</script>

<button
  on:click={openDialog}
  class="w-full px-2 bg-transparent text-white rounded focus:outline-none text-sm flex items-center"
>
  <Settings class="h-4 w-4 mr-2" />
  <span>Set system prompt</span>
</button>

{#if dialogOpen}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-neutral-800 p-6 rounded-lg w-full max-w-xl">
      <h2 class="text-lg font-semibold text-white mb-4">System Prompt</h2>
      <textarea
        bind:value={tempSystemPrompt}
        bind:this={textareaElement}
        on:input={autoResize}
        placeholder="Enter your custom system prompt here..."
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
