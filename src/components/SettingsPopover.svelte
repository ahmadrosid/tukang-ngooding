<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import XIcon from 'lucide-svelte/icons/x';
  import { fade } from 'svelte/transition';

  const dispatch = createEventDispatcher();

  export let show = false;

  let systemPrompt: string = '';
  let rootFolder: string = '';
  let activeTab: 'general' | 'advanced' = 'general';

  function closePopover() {
    show = false;
    dispatch('close');
  }

  function saveSettings() {
    console.log('Saving settings:', { systemPrompt, rootFolder });
    closePopover();
  }

  function setActiveTab(tab: 'general' | 'advanced') {
    activeTab = tab;
  }
</script>

<div class:show class:hidden={!show}>
  <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions (intentionally using div for overlay) -->
  <div
    class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    on:click|self={closePopover}
  >
    <div
      class="bg-neutral-800 rounded-lg w-full max-w-4xl h-[80vh] shadow-lg flex"
      transition:fade={{ duration: 200 }}
    >
      <!-- Sidebar -->
      <div class="w-1/4 p-4 border-r border-neutral-700/50 bg-neutral-800 rounded-l-lg">
        <h2 class="text-xl font-bold text-white mb-4">Settings</h2>
        <ul class="space-y-2">
          <li>
            <button
              class={`w-full text-left py-2 px-4 rounded text-sm ${activeTab === 'general' ? 'bg-neutral-700 text-white' : 'text-gray-400 hover:bg-neutral-700 hover:text-white'}`}
              on:click={() => setActiveTab('general')}
            >
              Root
            </button>
          </li>
          <li>
            <button
              class={`w-full text-left py-2 px-4 rounded text-sm ${activeTab === 'advanced' ? 'bg-neutral-700 text-white' : 'text-gray-400 hover:bg-neutral-700 hover:text-white'}`}
              on:click={() => setActiveTab('advanced')}
            >
              System Prompt
            </button>
          </li>
        </ul>
      </div>

      <!-- Content -->
      <div class="w-3/4 p-6 bg-neutral-700/40 rounded-r-lg">
        <div class="flex justify-end mb-4">
          <button 
            on:click={closePopover} 
            class="text-gray-400 hover:text-white"
            aria-label="Close settings"
          >
            <XIcon class="size-4" />
          </button>
        </div>

        {#if activeTab === 'general'}
          <div class="mb-4 space-y-2">
            <label for="rootFolder" class="block text-sm font-medium text-gray-300 mb-1">
              Root Folder
            </label>
            <input
              type="text"
              id="rootFolder"
              bind:value={rootFolder}
              class="w-full bg-neutral-700 text-white rounded p-2 border border-neutral-600/50"
            />
          </div>
        {:else if activeTab === 'advanced'}
          <div class="mb-4 space-y-2">
            <label for="systemPrompt" class="block text-sm font-medium text-gray-300 mb-1">
              System Prompt
            </label>
            <textarea
              id="systemPrompt"
              bind:value={systemPrompt}
              class="w-full bg-neutral-700 text-white rounded p-2 border border-neutral-600/50"
              rows="4"
            ></textarea>
          </div>
        {/if}
        <div class="flex justify-end">
          <button
            on:click={saveSettings}
            class="px-4 bg-blue-600 text-white rounded py-2 hover:bg-blue-700 focus:outline-none text-sm"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
