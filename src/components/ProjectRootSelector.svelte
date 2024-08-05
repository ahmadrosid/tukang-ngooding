<script lang="ts">
  import { onMount } from "svelte";
  import FolderIcon from "lucide-svelte/icons/folder";
  import { createEventDispatcher } from "svelte";
  import { projectRoot } from '$lib/store';

  const dispatch = createEventDispatcher<{ updateRoot: string }>();

  let dialogOpen = false;
  let newRootFolder = "";
  let error = "";

  onMount(() => {
    const storedRoot = localStorage.getItem("projectRoot");
    if (storedRoot) {
      newRootFolder = storedRoot;
    }
  });

  async function handleUpdateRootFolder() {
    localStorage.setItem("projectRoot", newRootFolder);
    const response = await fetch("/api/set-project-root", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newRoot: newRootFolder }),
    });
    if (response.ok) {
      projectRoot.set(newRootFolder);
      dialogOpen = false;
      dispatch("updateRoot", newRootFolder);
      error = "";
    } else {
      error = "Failed to update project root.";
    }
  }

  function openDialog() {
    dialogOpen = true;
  }
</script>

<button
  on:click={openDialog}
  class="w-full px-2 bg-transparent text-white rounded focus:outline-none text-xs flex items-center flex-1"
>
  <FolderIcon class="h-4 w-4 mr-2" />
  <span>Root</span>
</button>

{#if dialogOpen}
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-neutral-800 p-6 rounded-lg w-full max-w-xl">
      <h2 class="text-lg font-semibold text-white mb-4">Project Root Folder</h2>
      <div class="w-full">
        <label
          for="projectRoot"
          class="block text-sm font-medium text-white mb-2">Folder Path</label
        >
        <div class="flex">
          <input
            id="projectRoot"
            type="text"
            bind:value={newRootFolder}
            class="bg-neutral-700 rounded text-white text-sm focus:outline-none w-full p-2"
            placeholder="Enter folder path (e.g., ./src)"
          />
          <button
            on:click={handleUpdateRootFolder}
            class="ml-2 p-2 text-white rounded hover:bg-orange-700 focus:outline-none"
          >
            <FolderIcon class="w-4 h-4" />
          </button>
        </div>
        {#if error}
          <p class="text-xs text-red-500">{error}</p>
        {/if}
      </div>
      <div class="flex justify-end mt-4 space-x-2">
        <button
          on:click={() => (dialogOpen = false)}
          class="px-4 py-2 bg-neutral-700 text-white rounded hover:bg-neutral-600 focus:outline-none text-sm"
        >
          Cancel
        </button>
        <button
          on:click={handleUpdateRootFolder}
          class="px-4 py-2 bg-orange-800 text-white rounded hover:bg-orange-700 focus:outline-none text-sm"
        >
          Save
        </button>
      </div>
    </div>
  </div>
{/if}
