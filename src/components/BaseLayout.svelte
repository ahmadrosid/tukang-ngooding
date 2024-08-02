<script lang="ts">
  import FileSelectDialog from "./FileSelectDialog.svelte";
  import CreateFileDialog from "./CreateFileDialog.svelte";
  import Sidebar from "./Sidebar.svelte";
  import { updateCode } from "$lib/code_store";
  import ProjectRootSelector from "./ProjectRootSelector.svelte";

  let createFileDialogOpen = false;

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

  function handleCreateFile(event: CustomEvent<{ fileName: string; content: string }>) {
    const { fileName, content } = event.detail;
    updateCode({
      code: content,
      language: fileName.split('.').pop()?.toLowerCase() || "typescript",
      path: fileName,
      fileName: fileName.split('/').pop() || "",
      lastModified: new Date().toISOString(),
      size: content.length,
      isDirty: false,
    });
  }

  function handleRootFolderUpdate(event: CustomEvent<string>) {
    console.log(event.detail);
  }
</script>

<div class="flex h-screen text-white font-sans">
  <Sidebar on:createFile={() => createFileDialogOpen = true} />
  <main class="flex-grow overflow-y-auto bg-neutral-900 relative">
    <slot></slot>
    <ProjectRootSelector on:updateRootFolder={handleRootFolderUpdate} />
  </main>
  <FileSelectDialog
    submitLabel="Open File"
    on:fileSelected={handleFileSelected}
  />
  <CreateFileDialog
    bind:open={createFileDialogOpen}
    on:createFile={handleCreateFile}
    on:close={() => createFileDialogOpen = false}
  />
</div>
