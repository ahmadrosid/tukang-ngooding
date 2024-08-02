<script lang="ts">
    import { fetchFileTree } from '$lib/api';
    import { onMount } from 'svelte';
    import FolderIcon from 'lucide-svelte/icons/folder';
    import Settings from 'lucide-svelte/icons/settings';
  
    let dialogOpen = false;
    let newRootFolder = '';
    let isValid = true;
    let folderContents: { name: string, type: string }[] = [];
    let loading = false;
    let error = '';
  
    // Function to fetch and validate the folder contents
    async function validateFolder(path: string): Promise<boolean> {
      loading = true;
      error = ''; // Clear previous errors
      try {
        const data = await fetchFileTree(path);
        if (!data || data.files.length === 0) {
          error = "Empty or invalid folder.";
          return false;
        }
        folderContents = data.files;
        return true;
      } catch (e) {
        error = "Error fetching folder contents.";
        return false;
      } finally {
        loading = false;
      }
    }
  
    onMount(async () => {
      // You might want to fetch the initial root folder here and set it
    });
  
    function handleUpdateRootFolder() {
      // Validate the new path
      validateFolder(newRootFolder)
        .then((valid) => {
          isValid = valid;
          if (isValid) {
            // Dispatch an event to the parent component with the new root folder
            // and update the app's state accordingly
          }
        });
    }
  
    function openDialog() {
      dialogOpen = true;
    }
  </script>
  
  <button
    on:click={openDialog}
    class="w-full px-2 bg-transparent text-white rounded focus:outline-none text-sm flex items-center"
  >
    <Settings class="h-4 w-4 mr-2" />
    <span>Set Project Root</span>
  </button>
  
  {#if dialogOpen}
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-neutral-800 p-6 rounded-lg w-full max-w-xl">
        <h2 class="text-lg font-semibold text-white mb-4">Project Root Folder</h2>
        <div class="w-full">
          <label for="projectRoot" class="block text-sm font-medium text-white mb-2">Folder Path</label>
          <div class="flex">
            <input 
              id="projectRoot" 
              type="text" 
              class:border-red-500={!isValid} 
              bind:value={newRootFolder} 
              on:input={handleUpdateRootFolder} 
              class="bg-neutral-700 rounded text-white text-sm focus:outline-none w-full p-2" 
              placeholder="Enter folder path (e.g., ./src)" 
            />
            <button
              on:click={handleUpdateRootFolder} 
              class="ml-2 p-2 text-white rounded hover:bg-neutral-600 disabled:bg-neutral-500"
              disabled={loading}
            >
              <FolderIcon class="w-4 h-4" />
            </button>
          </div>
          {#if loading}
            <p class="text-xs text-neutral-400">Checking...</p>
          {/if}
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
            disabled={loading || !isValid}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  {/if}
  