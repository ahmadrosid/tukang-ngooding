<script lang="ts">
  import { PaneGroup, Pane, PaneResizer } from "paneforge";
  import ChatUI from "../components/ChatUI.svelte";
  import CodeEditor from "../components/CodeEditor.svelte";
  import { codeStore, resetCode, updateCode, type CodeStoreType } from "$lib/code-store";
  import { filePaths } from "$lib/file-path-store";
  import AddFileContext from "../components/AddFileContext.svelte";
	import { projectRoot } from '$lib/project-root-store';

  let leftSize = 50;
  let rightSize = 50;
  let showAddFileContext = false;
  let codeValue: CodeStoreType;
	let currentRoot: string;

  $: if ($projectRoot !== currentRoot) {
		currentRoot = $projectRoot;
		resetCode();
	}

  $: {
    codeValue = $codeStore;
    if (codeValue?.path && !$filePaths.includes(codeValue.path)) {
      filePaths.update(paths => [...paths, codeValue.path]);
    }
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
</script>

<svelte:head>
  <title>Tukang Ngooding</title>
  <meta name="robots" content="noindex nofollow" />
</svelte:head>

<PaneGroup direction="horizontal" class="w-full">
  <Pane defaultSize={leftSize}>
    <div class="px-4">
      <ChatUI on:addFile={() => showAddFileContext = true} />
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
        filePath={codeValue?.path}
        on:change={handleCodeChange}
      />
    </div>
  </Pane>
</PaneGroup>

<AddFileContext bind:open={showAddFileContext} />