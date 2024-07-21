<script lang="ts">
    import { onMount } from 'svelte';
  
    let sampleChat = [
      {
        content: `Hi, it's Tukang Koding here! How can I help you today?`,
        role: "assistant",
      },
    ];
  
    let messages = sampleChat;
    let inputValue = "";
  
    function handleSubmit() {
      if (inputValue.trim()) {
        messages = [...messages, { content: inputValue, role: "user" }];
        inputValue = "";
        setTimeout(() => {
          messages = [
            ...messages,
            { content: "Hi, how can I help you today?", role: "assistant" },
          ];
        }, 1000);
      }
    }
  
    onMount(() => {
      const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
      textarea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleSubmit();
        }
      });
    });
  </script>
  
  <div class="text-white text-sm">
    <div class="h-screen relative overflow-auto">
      <div class="min-h-screen">
        <div class="max-w-4xl mx-auto w-full space-y-4 p-2 py-4">
          {#each messages as message, index (index)}
            <div>
              <div class="gap-4 flex">
                <div class="bg-neutral-800 border border-neutral-700/20 rounded-2xl flex p-4 gap-3 shadow-sm">
                    {#if message.role === "user"}
                      <div>
                        <span class="p-1.5 text-sm rounded-full bg-purple-500">
                          ME
                        </span>
                      </div>
                    {/if}
                  <div class="whitespace-pre-wrap">{message.content}</div>
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>
      <div class="sticky bottom-0 inset-x-0 w-full">
        <form on:submit|preventDefault={handleSubmit} class="max-w-4xl w-full mx-auto">
          <div class="flex p-3 pb-6 bg-neutral-800 rounded-t-xl border border-neutral-700/60 w-full">
            <textarea
              rows="2"
              bind:value={inputValue}
              placeholder="Type a message..."
              class="text-sm flex-grow bg-neutral-800 text-white px-2 py-1 focus:outline-none resize-none"
            />
            <div>
              <button
                type="submit"
                class="text-xs bg-orange-800 text-neutral-200 rounded-lg px-4 ml-1.5 py-2 transition-colors duration-300 ease-in-out hover:bg-orange-700 focus:outline-none"
              >
                Send
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>