<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import Monaco from "svelte-monaco";
  import { Loader2 } from 'lucide-svelte';
  
  export let value = '';
  export let language = '';
  export let theme: "vs-light" | "vs-dark" = "vs-light";
  const dispatch = createEventDispatcher();
  
  let editorReady = false;
  let editor: any;
  
  function debounce(func: Function, delay: number) {
    let timeoutId: ReturnType<typeof setTimeout>;
    return function (this: any, ...args: any[]) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  }
  
  const handleChange = debounce((newValue: string) => {
    dispatch('change', newValue);
  }, 800); // 800ms debounce
  
  $: if (value) {
    handleChange(value);
  }
  
  function handleReady(event: CustomEvent) {
    editorReady = true;
    editor = event.detail.editor;
  }

  onMount(() => {
    return () => {
      if (editor) {
        editor.dispose();
      }
    };
  });

  function handleSave(event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
      event.preventDefault();
      dispatch('save', value);
    }
  }
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
