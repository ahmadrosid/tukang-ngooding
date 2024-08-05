<script lang="ts">
  import { onMount } from "svelte";
  import { useChat } from "@ai-sdk/svelte";
  import MessageItem from "./MessageItem.svelte";
  import SetSystemPrompt from "./SetSystemPrompt.svelte";
  import Trash from 'lucide-svelte/icons/trash-2';

  export let filePath: string;

  let textareaElement: HTMLTextAreaElement;
  let customSystemPrompt: string = '';

  type ChatBody = {
    file?: string;
    systemPrompt?: string;
  }

  const { input, handleSubmit, messages, stop, isLoading, setMessages } = useChat({
    initialMessages: [
      {
        id: "1",
        content: `Hi, I'm Tukang Ngooding! How can I help you today?`,
        role: "assistant",
      },
    ],
  });

  function autoResize() {
    if (textareaElement) {
      textareaElement.style.height = "auto";
      textareaElement.style.height = textareaElement.scrollHeight + "px";
    }
  }

  function handleFormSubmit(e: Event) {
    e.preventDefault();
    let body: ChatBody = {};
    if (customSystemPrompt !== '') {
      body.systemPrompt = customSystemPrompt;
    }
    if (filePath !== '') {
      body.file = filePath;
    }
    handleSubmit(e, { body });
    autoResize();
  }

  function clearMessages() {
    setMessages([{
      id: "1",
      content: `Hi, I'm Tukang Ngooding! How can I help you today?`,
      role: "assistant",
    }]);
  }

  onMount(() => {
    if (textareaElement) {
      textareaElement.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          handleFormSubmit(e);
        }
      });
      autoResize();
    }
  });

  $: if ($input) autoResize();
</script>

<div class="text-white text-sm">
  <div class="h-screen relative overflow-auto scrollbar-hide">
    <div class="min-h-screen text-sm">
      <div class="max-w-4xl mx-auto w-full space-y-4 p-2 py-4">
        <SetSystemPrompt on:update={e => customSystemPrompt = e.detail} />
        {#each $messages as message}
          <MessageItem {message} />
        {/each}
      </div>
    </div>
    <div class="sticky bottom-0 inset-x-0 w-full">
      <div class="p-2 text-xs text-neutral-400 sticky top-0 bg-neutral-900 flex justify-between items-center">
        <div>
        {#if filePath}
            Context file: <span class="font-semibold">{filePath}</span>
            {/if}
        </div>
        <button
            on:click={clearMessages}
            class="text-xs text-neutral-400 rounded-lg px-2 py-1 transition-colors duration-300 ease-in-out hover:text-neutral-200 focus:outline-none flex items-center"
            >
            <Trash size={14} class="mr-1" />
            Clear messages
        </button>

      </div>
      <form
        on:submit={handleFormSubmit}
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
