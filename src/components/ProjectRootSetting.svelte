<script lang="ts">
  import { onMount } from "svelte";
  import FolderIcon from "lucide-svelte/icons/folder";
  import { createEventDispatcher } from "svelte";
  import { projectRoot } from '$lib/store';

  const dispatch = createEventDispatcher<{ updateRoot: string, cancel: void }>();

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

  async function openFolderDialog() {
    try {
      const directoryHandle = await window.showDirectoryPicker();

      // TODO: get the full path, currently only the name is returned
      // we might need to creat custom api to get the full path
      newRootFolder = directoryHandle.name;
    } catch (err) {
      console.error("Error selecting folder:", err);
      error = "Failed to select folder. Please try again.";
    }
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
      class="block text-sm font-medium text-white mb-2">Select Project Root Folder</label
    >
    <div class="flex">
      <input
        id="projectRoot"
        type="text"
        bind:value={newRootFolder}
        class="bg-neutral-700 rounded-l text-white text-sm focus:outline-none w-full p-2"
        placeholder="No folder selected"
        readonly
      />
      <button
        on:click={openFolderDialog}
        class="bg-neutral-600 text-white rounded-r px-4 py-2 hover:bg-neutral-500 focus:outline-none"
      >
        <FolderIcon class="size-4" />
      </button>
    </div>
    {#if error}
      <p class="text-xs py-4 text-red-500">{error}</p>
    {/if}

    <div class="flex justify-end mt-4 space-x-2">
      <button
        on:click={() => dispatch('cancel')}
        class="px-4 py-1.5 bg-neutral-600 text-white rounded hover:bg-neutral-500 focus:outline-none text-sm"
      >
        Cancel
      </button>
      <button
        on:click={handleUpdateRootFolder}
        class="px-4 py-1.5 bg-orange-700 text-white rounded hover:bg-orange-600 focus:outline-none text-sm"
      >
        Save
      </button>
    </div>
  </div>
</div>
