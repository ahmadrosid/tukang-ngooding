<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import XIcon from "lucide-svelte/icons/x";
  import ProjectRootSelector from "./ProjectRootSetting.svelte";
  import LLMProviderSetting from "./LLMProviderSetting.svelte";
  import { fade } from "svelte/transition";

  const dispatch = createEventDispatcher();

  export let show = false;

  let systemPrompt: string = "";
  let rootFolder: string = "";
  let activeTab: "root" | "system" | "llm" = "root";

  function closePopover() {
    show = false;
    dispatch("close");
  }

  function saveSettings() {
    console.log("Saving settings:", { systemPrompt, rootFolder });
    closePopover();
  }

  function setActiveTab(tab: "root" | "system" | "llm") {
    activeTab = tab;
  }

  function handleUpdateProvider(event: CustomEvent<"anthropic" | "openai">) {
    saveSettings();
  }
</script>

<svelte:window on:keydown={(e) => e.key === "Escape" && closePopover()} />

<div class:show class:hidden={!show}>
  <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions (intentionally using div for overlay) -->
  <div
    class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    on:click|self={closePopover}
  >
    <div
      class="bg-neutral-800 rounded-lg w-full max-w-[60vw] h-[80vh] shadow-lg flex"
      transition:fade={{ duration: 200 }}
    >
      <!-- Sidebar -->
      <div
        class="w-1/4 p-4 border-r border-neutral-700/50 bg-neutral-800 rounded-l-lg"
      >
        <h2 class="text-xl font-bold text-white mb-4">Settings</h2>
        <ul class="space-y-2">
          <li>
            <button
              class={`w-full text-left py-2 px-4 rounded text-sm ${activeTab === "root" ? "bg-neutral-700 text-white" : "text-gray-400 hover:bg-neutral-700 hover:text-white"}`}
              on:click={() => setActiveTab("root")}
            >
              Root
            </button>
          </li>
          <li>
            <button
              class={`w-full text-left py-2 px-4 rounded text-sm ${activeTab === "system" ? "bg-neutral-700 text-white" : "text-gray-400 hover:bg-neutral-700 hover:text-white"}`}
              on:click={() => setActiveTab("system")}
            >
              System Prompt
            </button>
          </li>
          <li>
            <button
              class={`w-full text-left py-2 px-4 rounded text-sm ${activeTab === "llm" ? "bg-neutral-700 text-white" : "text-gray-400 hover:bg-neutral-700 hover:text-white"}`}
              on:click={() => setActiveTab("llm")}
            >
              LLM Provider
            </button>
          </li>
        </ul>
      </div>

      <!-- Content -->
      <div class="w-3/4 p-6 bg-neutral-700/40 rounded-r-lg relative overflow-auto scrollbar-hide">
        <div class="absolute top-6 right-6">
          <button
            on:click={closePopover}
            class="text-gray-400 hover:text-white"
            aria-label="Close settings"
          >
            <XIcon class="size-4" />
          </button>
        </div>

        {#if activeTab === "root"}
          <ProjectRootSelector on:cancel={closePopover} on:updateRoot={closePopover} />
        {:else if activeTab === "system"}
          <div class="mb-4 space-y-2">
            <label
              for="systemPrompt"
              class="block text-sm font-medium text-gray-300 mb-1"
            >
              System Prompt
            </label>
            <textarea
              id="systemPrompt"
              bind:value={systemPrompt}
              class="w-full bg-neutral-700 text-white rounded p-2 border border-neutral-600/50"
              rows="4"
            ></textarea>
          </div>
          <div class="mt-6">
            <button
              on:click={saveSettings}
              class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Save System Prompt
            </button>
          </div>
        {:else if activeTab === "llm"}
          <LLMProviderSetting 
            on:updateProvider={handleUpdateProvider}
          />
        {/if}
      </div>
    </div>
  </div>
</div>
