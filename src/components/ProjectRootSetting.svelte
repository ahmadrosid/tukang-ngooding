<script lang="ts">
  import { onMount } from "svelte";
  import FolderIcon from "lucide-svelte/icons/folder";
  import { createEventDispatcher } from "svelte";
  import { projectRoot } from '$lib/store';

  const dispatch = createEventDispatcher<{ updateRoot: string }>();

  let newRootFolder = "";
  let error = "";
  let recentRoots: string[] = [];

  onMount(() => {
    const storedRoot = localStorage.getItem("projectRoot");
    if (storedRoot) {
      newRootFolder = storedRoot;
    }
    loadRecentRoots();
  });

  function loadRecentRoots() {
    const storedHistory = localStorage.getItem("recentProjectRoots");
    if (storedHistory) {
      recentRoots = JSON.parse(storedHistory);
    }
  }

  function updateRecentRoots(root: string) {
    recentRoots = [root, ...recentRoots.filter(r => r !== root)].slice(0, 5);
    localStorage.setItem("recentProjectRoots", JSON.stringify(recentRoots));
  }

  async function handleUpdateRootFolder() {
    localStorage.setItem("projectRoot", newRootFolder);
    updateRecentRoots(newRootFolder);
    const response = await fetch("/api/set-project-root", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newRoot: newRootFolder }),
    });
    if (response.ok) {
      projectRoot.set(newRootFolder);
      dispatch("updateRoot", newRootFolder);
      error = "";
    } else {
      error = "Failed to update project root.";
    }
  }

  async function selectRecentRoot(root: string) {
    newRootFolder = root;
    await handleUpdateRootFolder();
  }

</script>

<div>
  <h2 class="text-lg font-semibold text-white mb-4">Project Root Folder</h2>
  {#if recentRoots.length > 0}
    <div class="mb-6 bg-neutral-800 rounded-md p-4">
      <h3 class="text-sm font-semibold text-white mb-3">Recent Roots</h3>
      <ul class="space-y-2">
        {#each recentRoots as root}
          <li>
            <button
              on:click={() => selectRecentRoot(root)}
              class="w-full text-left px-3 py-2 text-sm text-gray-300 bg-neutral-700/50 hover:text-white hover:bg-neutral-700 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <span class="truncate block">{root}</span>
            </button>
          </li>
        {/each}
      </ul>
    </div>
  {/if}
  <div class="w-full bg-neutral-800 rounded-md p-4">
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
      <p class="text-xs py-4 text-red-500">{error}</p>
    {/if}

    <div class="flex justify-end mt-4">
      <button
        on:click={handleUpdateRootFolder}
        class="px-4 py-1.5 bg-orange-700 text-white rounded hover:bg-orange-600 focus:outline-none text-sm"
      >
        Save
      </button>
    </div>
  </div>
  
</div>
