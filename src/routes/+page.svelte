<script lang="ts">
  import { PaneGroup, Pane, PaneResizer } from "paneforge";
  import BaseLayout from "../components/BaseLayout.svelte";
  import ChatUI from "../components/ChatUI.svelte";
  import CodeEditor from "../components/CodeEditor.svelte";
  import { codeStore, updateCode, type CodeStoreType } from "$lib/code_store";
  import { updateFile } from '$lib/api';

  let leftSize = 50;
  let rightSize = 50;

  let codeValue: CodeStoreType;
  let filePath = "";

  $: {
    codeValue = $codeStore;
    filePath = codeValue?.path || "";
  }

  function handleCodeChange(event: CustomEvent<string>) {
    updateCode({ ...codeValue, code: event.detail });
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
</script>

<svelte:head>
  <title>Tukang Ngooding</title>
  <meta name="robots" content="noindex nofollow" />
</svelte:head>

<BaseLayout>
  <PaneGroup direction="horizontal" class="w-full">
    <Pane defaultSize={leftSize}>
      <div class="px-4">
        <ChatUI {filePath} />
      </div>
    </Pane>
    <PaneResizer
      class="relative flex bg-neutral-800 w-[2px] items-center justify-center"
    />
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
