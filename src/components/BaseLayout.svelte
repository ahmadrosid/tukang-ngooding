<script lang="ts">
  import FileSelectDialog from "./FileSelectDialog.svelte";
  import Sidebar from "./Sidebar.svelte";
  import { updateCode } from "$lib/code_store";
  import { onMount } from 'svelte';

  async function openFile(file: { name: string; type: string }): Promise<void> {
    try {
      const encodedFilePath = encodeURIComponent(file.name);
      const response = await fetch(`/api/files/fetch?file=${encodedFilePath}`);
      const data = await response.json();
      updateCode({
        code: data.content || "",
        language: data.language.toLowerCase() || "typescript",
        path: file.name || "",
        fileName: file.name,
        lastModified: new Date().toISOString(),
        size: 0,
        isDirty: false,
      });
    } catch (error) {
      console.error("Error fetching file content:", error);
    }
  }

  let openFileDialog = false;

  function handleFileSelected(
    file: CustomEvent<{ name: string; type: string }>
  ) {
    openFile(file.detail);
  }

  function handleKeydown(event: KeyboardEvent) {
    console.log('keydown', event.key);
    if (event.key === "j" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      openFileDialog = true;
      console.log('openFileDialog', openFileDialog);
    }

    if (event.key === "Escape") {
      openFileDialog = false;
    }
  }

  onMount(() => {
    window.addEventListener('keydown', handleKeydown);
    return () => {
      console.log('removing keydown listener');
      window.removeEventListener('keydown', handleKeydown);
    };
  });
</script>

<div class="flex h-screen text-white font-sans">
  <Sidebar />
  <main class="flex-grow overflow-y-auto bg-neutral-900 relative">
    <slot></slot>
  </main>
  <FileSelectDialog
    open={openFileDialog}
    submitLabel="Open File"
    on:fileSelected={handleFileSelected}
  />
</div>
