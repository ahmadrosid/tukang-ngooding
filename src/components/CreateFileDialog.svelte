<script lang="ts">
  import { createFile } from '$lib/api';

  let { open = $bindable(false), onCreateFile, onClose } = $props();

  let fileName = $state("");
  let content = $state("");
  let creating = $state(false);
  let error = $state("");

  function closeDialog(): void {
    onClose();
    open = false;
    resetForm();
  }

  function resetForm(): void {
    fileName = "";
    content = "";
    error = "";
    creating = false;
  }

  async function handleCreateFile(e: SubmitEvent): Promise<void> {
    e.preventDefault();
    if (!fileName.trim()) {
      error = "File name is required";
      return;
    }

    creating = true;
    error = "";

    try {
      await createFile(fileName, content);
      onCreateFile({ fileName, content });
      closeDialog();
    } catch (err) {
      error = err instanceof Error ? err.message : String(err);
    } finally {
      creating = false;
    }
  }
</script>
<svelte:window onkeydown={(e) => e.key === "Escape" && closeDialog()} />

<div
  class:hidden={!open}
  class:fixed={open}
  class="inset-0 bg-black bg-opacity-60 flex items-center justify-center z-10"
>
  <div
    class="bg-neutral-800 rounded-xl shadow-lg w-full max-w-xl ring-1 ring-neutral-700/70"
    role="button"
    tabindex="0"
    aria-label="Close create file modal"
    onkeydown={(e) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        closeDialog();
      }
    }}
  >
    <div class="p-6">
      <h2 class="text-xl font-semibold mb-4 text-white">Create New File</h2>
      <form onsubmit={handleCreateFile}>
        <div class="mb-4">
          <label
            for="fileName"
            class="block text-sm font-medium text-gray-300 mb-2"
            >File Name</label
          >
          <input
            type="text"
            id="fileName"
            bind:value={fileName}
            class="w-full p-2 bg-neutral-700 rounded text-white text-sm focus:outline-none"
            placeholder="Enter file name (e.g., src/components/NewComponent.svelte)"
          />
        </div>
        <div class="mb-4">
          <label
            for="content"
            class="block text-sm font-medium text-gray-300 mb-2"
            >File Content</label
          >
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
            onclick={closeDialog}
            class="px-4 py-2 bg-neutral-700 text-white rounded hover:bg-neutral-600 focus:outline-none text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-orange-700 text-white rounded hover:bg-orange-600 focus:outline-none text-sm"
            disabled={creating}
          >
            {creating ? "Creating..." : "Create File"}
          </button>
        </div>
      </form>
    </div>
  </div>
</div>
