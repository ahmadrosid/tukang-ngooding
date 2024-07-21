<script>
  import { PaneGroup, Pane, PaneResizer } from "paneforge";
  import BaseLayout from "../components/BaseLayout.svelte";
  import ChatUI from "../components/ChatUI.svelte";
  import CodeEditor from "../components/CodeEditor.svelte";

  let leftSize = 50;
  let rightSize = 50;
  let isLeftPaneVisible = true;

  function toggleLeftPane() {
    isLeftPaneVisible = !isLeftPaneVisible;
    if (isLeftPaneVisible) {
      leftSize = 50;
      rightSize = 50;
    } else {
      leftSize = 0;
      rightSize = 100;
    }
  }
</script>

<BaseLayout>
  <PaneGroup direction="horizontal" class="w-full">
    {#if isLeftPaneVisible}
      <Pane defaultSize={leftSize}>
        <div class="px-2">
          <ChatUI />
        </div>
      </Pane>
      <PaneResizer
        class="relative flex bg-neutral-800 w-[2px] items-center justify-center"
      >
      </PaneResizer>
    {/if}
    <Pane defaultSize={rightSize}>
      <div class="h-full">
        <CodeEditor
          language="typescript"
          theme="vs-dark"
          value="console.log('Hello, world!');"
        />
      </div>
    </Pane>
  </PaneGroup>
</BaseLayout>
