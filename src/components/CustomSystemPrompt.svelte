<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let systemPrompt: string = "";
  const dispatch = createEventDispatcher<{ update: string }>();

  function handleUpdate() {
    dispatch("update", systemPrompt);
  }
</script>

<div class="space-y-4">
  <h3 class="text-lg font-semibold text-white">Custom System Prompt</h3>
  <textarea
    bind:value={systemPrompt}
    placeholder="Enter your custom system prompt here..."
    rows={5}
    class="w-full p-2 bg-neutral-700 rounded text-white text-sm focus:outline-none resize-none"
  />
  <button
    on:click={handleUpdate}
    class="px-4 py-2 bg-orange-800 text-white rounded hover:bg-orange-700 focus:outline-none text-sm"
  >
    Update System Prompt
  </button>
</div>
