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

  function handleFileSelected(
    file: CustomEvent<{ name: string; type: string }>
  ) {
    openFile(file.detail);
  }
</script>

<div class="flex h-screen text-white font-sans">
  <Sidebar />
  <main class="flex-grow overflow-y-auto bg-neutral-900 relative">
    <slot></slot>
  </main>
  <FileSelectDialog
    submitLabel="Open File"
    on:fileSelected={handleFileSelected}
  />
</div>
