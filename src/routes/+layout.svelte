<script lang="ts">
  import "highlight.js/styles/github-dark.css";
  import "../app.css";

  import FileSelectDialog from "../components/FileSelectDialog.svelte";
  import CreateFileDialog from "../components/CreateFileDialog.svelte";
  import Sidebar from "../components/Sidebar.svelte";
  import SettingsPopover from "../components/SettingModal.svelte";
  import { updateCode } from "$lib/code-store";

  let showSettings = false;
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

  function handleCreateFile(
    event: CustomEvent<{ fileName: string; content: string }>
  ) {
    const { fileName, content } = event.detail;
    updateCode({
      code: content,
      language: fileName.split(".").pop()?.toLowerCase() || "typescript",
      path: fileName,
      fileName: fileName.split("/").pop() || "",
      lastModified: new Date().toISOString(),
      size: content.length,
      isDirty: false,
    });
  }
</script>

<div class="flex h-screen text-white font-sans">
  <Sidebar on:createFile={() => (createFileDialogOpen = true)} bind:showSettings={showSettings} />
  <main class="flex-grow overflow-y-auto bg-neutral-900 relative">
    <slot></slot>
  </main>
  <FileSelectDialog
    submitLabel="Open File"
    on:fileSelected={handleFileSelected}
  />
  <CreateFileDialog
    bind:open={createFileDialogOpen}
    on:createFile={handleCreateFile}
    on:close={() => (createFileDialogOpen = false)}
  />
  <SettingsPopover bind:show={showSettings} on:close={()=> showSettings = false} />
</div>
