<script lang="ts">
  import { PaneGroup, Pane, PaneResizer } from "paneforge";
  import BaseLayout from "../components/BaseLayout.svelte";
  import ChatUI from "../components/ChatUI.svelte";
  import CodeEditor from "../components/CodeEditor.svelte";
  import { codeStore, updateCode, type CodeStoreType } from "../lib/code_store";
  import { onMount } from "svelte";
  import FileSelectDialog from "../components/FileSelectDialog.svelte";

  let leftSize = 50;
  let rightSize = 50;
  let isLeftPaneVisible = true;

  let codeValue: CodeStoreType;

  onMount(() => {
    const unsubscribe = codeStore.subscribe((value) => {
      codeValue = value;
    });

    return unsubscribe;
  });

  function handleCodeChange(event: CustomEvent<string>) {
    codeStore.set({ ...codeValue, code: event.detail });
  }

  function getLanguage(value: CodeStoreType): string {
    if (value?.language) {
      switch (value.language.toLowerCase()) {
        case "svelte":
          return "html";
        default:
          return value.language.toLowerCase();
      }
    }
    return "typescript";
  }

  async function handleSave(code: string, path?: string) {
    if (!path) {
      return;
    }
    const result = await updateFile(path, code);
  }

  async function updateFile(filePath: string, content: string) {
    try {
      const response = await fetch("/api/files/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filePath, content }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update file");
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error updating file:", error);
      throw error;
    }
  }

  async function openFile(file: { name: string; type: string }): Promise<void> {
    try {
      const encodedFilePath = encodeURIComponent(file.name);
      const response = await fetch(`/api/files/fetch?file=${encodedFilePath}`);
      const data = await response.json();
      updateCode({
        code: data.content,
        language: data.language.toLowerCase() || "typescript",
        path: file.name,
        fileName: file.name,
        lastModified: new Date().toISOString(),
        size: 0,
        isDirty: false,
      });
    } catch (error) {
      console.error("Error fetching file content:", error);
    }
  }

  let openFileDialog: boolean = false;

  function handleFileSelected(
    file: CustomEvent<{ name: string; type: string }>
  ) {
    openFile(file.detail);
    filePath = file.detail.name;
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "j" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      openFileDialog = true;
    }
  }

  $: filePath = $codeStore.path || "";
</script>

<svelte:window on:keydown={handleKeydown} />

<svelte:head>
  <title>Tukang Ngooding</title>
  <meta name="robots" content="noindex nofollow" />
</svelte:head>

<BaseLayout>
  <FileSelectDialog
    open={openFileDialog}
    submitLabel="Open File"
    on:fileSelected={handleFileSelected}
  />

  <PaneGroup direction="horizontal" class="w-full">
    {#if isLeftPaneVisible}
      <Pane defaultSize={leftSize}>
        <div class="px-4">
          <ChatUI {filePath} />
        </div>
      </Pane>
      <PaneResizer
        class="relative flex bg-neutral-800 w-[2px] items-center justify-center"
      />
    {/if}
    <Pane defaultSize={rightSize}>
      <div class="h-full">
        <div class="p-2 text-sm">
          <p>
            {codeValue?.fileName}
          </p>
        </div>
        <CodeEditor
          language={getLanguage(codeValue)}
          theme="vs-dark"
          value={codeValue?.code || ""}
          on:change={handleCodeChange}
          on:save={async (event) =>
            await handleSave(event.detail, codeValue?.path)}
        />
      </div>
    </Pane>
  </PaneGroup>
</BaseLayout>