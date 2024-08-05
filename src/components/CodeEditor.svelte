<script lang="ts">
  import { onMount } from 'svelte';
  import Monaco from "svelte-monaco";
  import Loader2 from 'lucide-svelte/icons/loader'; 
  import { updateFile } from '$lib/api';
  
  export let value = '';
  export let language = '';
  export let filePath = '';
  export let theme: "vs-light" | "vs-dark" = "vs-light";
  
  let editorReady = false;
  let editor: any;

  function handleReady(event: CustomEvent) {
    editorReady = true;
    editor = event.detail.editor;
  }
  
  async function handleSave(event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
      event.preventDefault();
      if (filePath) {
        try {
            await updateFile(filePath, value);
        } catch (error) {
            console.error('Error saving file:', error);
        }
      }
    }
  }
  
  onMount(() => {
    return () => {
      if (editor) {
        editor.dispose();
      }
    };
  });
</script>

<svelte:window on:keydown={handleSave} />

{#if !editorReady}
<div class="grid place-content-center w-full h-full">
  <div class="flex gap-2 text-gray-200">
    <Loader2 size={24} class="animate-spin" />
    <span>Loading editor...</span>
  </div>
</div>
{/if}

<div class="w-full h-full" class:hidden={!editorReady}>
  <Monaco
    options={{
      language,
      automaticLayout: true,
      minimap: {
        enabled: false,
      },
      padding: {
        top: 20,
      }
    }}
    theme={theme}
    on:ready={handleReady}
    bind:value
  />
</div>
