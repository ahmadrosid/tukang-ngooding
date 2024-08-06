<script lang="ts">
  import { onMount } from 'svelte';
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  let currentProvider: "anthropic" | "openai";
  let anthropicApiKey: string;
  let openaiApiKey: string;

  onMount(() => {
    currentProvider = localStorage.getItem('llmProvider') as "anthropic" | "openai" || 'anthropic';
    anthropicApiKey = localStorage.getItem('anthropicApiKey') || '';
    openaiApiKey = localStorage.getItem('openaiApiKey') || '';
  });

  function saveProvider() {
    localStorage.setItem('llmProvider', currentProvider);
    if (currentProvider === 'anthropic') {
      localStorage.setItem('anthropicApiKey', anthropicApiKey);
    } else {
      localStorage.setItem('openaiApiKey', openaiApiKey);
    }
    dispatch("updateProvider", currentProvider);
  }
</script>

<div>
  <h2 class="text-base font-semibold text-white mb-4">LLM Provider Settings</h2>
  
  <div class="w-full bg-neutral-800 rounded-md p-4">
    <div class="text-sm font-medium text-white mb-2">
      Default LLM Provider
    </div>
    <div class="space-y-3">
      <label class="flex items-center cursor-pointer group">
        <input
          type="radio"
          bind:group={currentProvider}
          value="anthropic"
          class="hidden"
        />
        <div class="w-4 h-4 mr-3 rounded-full border border-gray-400 group-hover:border-orange-500 flex items-center justify-center">
          {#if currentProvider === 'anthropic'}
            <div class="w-2 h-2 rounded-full bg-orange-500"></div>
          {/if}
        </div>
        <span class="text-sm text-gray-300 group-hover:text-orange-500">Anthropic</span>
      </label>
      <label class="flex items-center cursor-pointer group">
        <input
          type="radio"
          bind:group={currentProvider}
          value="openai"
          class="hidden"
        />
        <div class="w-4 h-4 mr-3 rounded-full border border-gray-400 group-hover:border-orange-500 flex items-center justify-center">
          {#if currentProvider === 'openai'}
            <div class="w-2 h-2 rounded-full bg-orange-500"></div>
          {/if}
        </div>
        <span class="text-sm text-gray-300 group-hover:text-orange-500">OpenAI</span>
      </label>
    </div>

    <div class="mt-4">
      <div class="text-sm font-medium text-white mb-2">
        Anthropic API Key
      </div>
      <input
        type="password"
        bind:value={anthropicApiKey}
        class="w-full bg-neutral-700 text-white rounded p-2 text-sm"
        placeholder="Enter Anthropic API Key"
      />
    </div>

    <div class="mt-4">
      <div class="text-sm font-medium text-white mb-2">
        OpenAI API Key
      </div>
      <input
        type="password"
        bind:value={openaiApiKey}
        class="w-full bg-neutral-700 text-white rounded p-2 text-sm"
        placeholder="Enter OpenAI API Key"
      />
    </div>

    <div class="flex justify-end mt-4 space-x-2">
      <button
        on:click={() => dispatch('cancel')}
        class="px-4 py-1.5 bg-neutral-600 text-white rounded hover:bg-neutral-500 focus:outline-none text-sm"
      >
        Cancel
      </button>
      <button
        on:click={saveProvider}
        class="px-4 py-1.5 bg-orange-700 text-white rounded hover:bg-orange-600 focus:outline-none text-sm"
      >
        Save
      </button>
    </div>
  </div>
</div>
