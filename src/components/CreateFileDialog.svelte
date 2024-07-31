<script lang="ts">
    import { createEventDispatcher } from 'svelte';
  
    const dispatch = createEventDispatcher<{
      createFile: { fileName: string; content: string };
      close: void;
    }>();
  
    export let open = false;
  
    let fileName = '';
    let content = '';
    let creating = false;
    let error = '';
  
    function closeDialog(): void {
      dispatch('close');
      open = false;
      resetForm();
    }
  
    function resetForm(): void {
      fileName = '';
      content = '';
      error = '';
      creating = false;
    }
  
    async function createFile(): Promise<void> {
      if (!fileName.trim()) {
        error = 'File name is required';
        return;
      }
  
      creating = true;
      error = '';
  
      try {
        const response = await fetch('/api/files/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ fileName, content }),
        });
  
        const result = await response.json();
  
        if (!response.ok) {
          throw new Error(result.error || 'Failed to create file');
        }
  
        dispatch('createFile', { fileName, content });
        closeDialog();
      } catch (err) {
        error = err instanceof Error ? err.message : String(err);
      } finally {
        creating = false;
      }
    }
  </script>
  
  <div class:hidden={!open} class:fixed={open} class="inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
    <div class="bg-neutral-800 rounded-xl shadow-lg w-full max-w-xl ring-1 ring-neutral-700/70">
      <div class="p-6">
        <h2 class="text-xl font-semibold mb-4 text-white">Create New File</h2>
        <form on:submit|preventDefault={createFile}>
          <div class="mb-4">
            <label for="fileName" class="block text-sm font-medium text-gray-300 mb-2">File Name</label>
            <input
              type="text"
              id="fileName"
              bind:value={fileName}
              class="w-full p-2 bg-neutral-700 rounded text-white text-sm focus:outline-none"
              placeholder="Enter file name (e.g., src/components/NewComponent.svelte)"
            />
          </div>
          <div class="mb-4">
            <label for="content" class="block text-sm font-medium text-gray-300 mb-2">File Content</label>
            <textarea
              id="content"
              bind:value={content}
              class="w-full p-2 bg-neutral-700 rounded text-white text-sm h-32 resize-none focus:outline-none"
              placeholder="Enter initial file content (optional)"
            ></textarea>
          </div>
          {#if error}
            <p class="text-red-500 text-sm mb-4">{error}</p>
          {/if}
          <div class="flex justify-end gap-2">
            <button
              type="button"
              on:click={closeDialog}
              class="px-4 py-2 bg-neutral-700 text-white rounded hover:bg-neutral-600 focus:outline-none text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-orange-700 text-white rounded hover:bg-orange-600 focus:outline-none text-sm"
              disabled={creating}
            >
              {creating ? 'Creating...' : 'Create File'}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>