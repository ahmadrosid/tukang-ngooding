<script lang="ts">
  import { onMount, afterUpdate } from "svelte";
  import { useChat } from "@ai-sdk/svelte";
  import MessageItem from "./MessageItem.svelte";
  import CustomSystemPrompt from "./CustomSystemPrompt.svelte";

  export let filePath: string;

  let textareaElement: HTMLTextAreaElement;
  let chatInstance: ReturnType<typeof useChat>;
  let customSystemPrompt: string = '';

  $: {
    // Re-initialize chat when filePath or customSystemPrompt changes
    chatInstance = useChat({
      body: {
        file: filePath,
        systemPrompt: customSystemPrompt,
      },
      initialMessages: [
        {
          id: "1",
          content: `Hi, I'm Tukang Ngooding! How can I help you today?`,
          role: "assistant",
        },
      ],
    });
  }

  $: ({ input, handleSubmit, messages, stop, isLoading } = chatInstance);

  function autoResize() {
    if (textareaElement) {
      textareaElement.style.height = "auto";
      textareaElement.style.height = textareaElement.scrollHeight + "px";
    }
  }

  function handleSystemPromptUpdate(event: CustomEvent<string>) {
    customSystemPrompt = event.detail;
    // Re-initialize chat with new system prompt
    chatInstance = useChat({
      body: {
        file: filePath,
        systemPrompt: customSystemPrompt,
      },
      initialMessages: [
        {
          id: "1",
          content: `Hi, I'm Tukang Ngooding! How can I help you today?`,
          role: "assistant",
        },
      ],
    });
  }

  onMount(() => {
    if (textareaElement) {
      textareaElement.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          handleSubmit();
          autoResize();
        }
      });
      autoResize(); // Initial resize
    }
  });

  $: if ($input) autoResize();
</script>

<div class="text-white text-sm">
  <div class="h-screen relative overflow-auto scrollbar-hide">
    <div class="min-h-screen text-sm">
      <div class="max-w-4xl mx-auto w-full space-y-4 p-2 py-4">
        <CustomSystemPrompt
          bind:systemPrompt={customSystemPrompt}
          on:update={handleSystemPromptUpdate}
        />
        {#if filePath}
          <div class="p-2 text-xs text-neutral-400 sticky top-0 bg-neutral-900">
            Context file: <span class="font-semibold">{filePath}</span>
          </div>
        {/if}
        {#each $messages as message}
          <MessageItem {message} />
        {/each}
      </div>
    </div>
    <div class="sticky bottom-0 inset-x-0 w-full">
      <form
        on:submit|preventDefault={handleSubmit}
        class="max-w-4xl w-full mx-auto"
      >
        <div
          class="flex p-3 pb-6 bg-neutral-800 rounded-t-xl border border-neutral-700/60 w-full"
        >
          <textarea
            bind:this={textareaElement}
            bind:value={$input}
            on:input={autoResize}
            placeholder="Type a message..."
            class="text-sm flex-grow bg-neutral-800 text-white px-2 py-1 focus:outline-none resize-none overflow-y-scrool max-h-[300px]"
          />
          <div>
            {#if !$isLoading}
              <button
                type="submit"
                class="text-xs bg-orange-800 text-neutral-200 rounded-lg px-4 ml-1.5 py-2 transition-colors duration-300 ease-in-out hover:bg-orange-700 focus:outline-none"
              >
                Send
              </button>
            {:else}
              <button
                type="button"
                on:click={stop}
                class="text-xs bg-orange-800 text-neutral-200 rounded-lg px-4 ml-1.5 py-2 transition-colors duration-300 ease-in-out hover:bg-orange-700 focus:outline-none"
              >
                Stop
              </button>
            {/if}
          </div>
        </div>
      </form>
    </div>
  </div>
</div>