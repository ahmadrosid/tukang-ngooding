<script lang="ts">
  import type { TreeNode } from "$lib/file-utils";
  import { updateCode } from "$lib/code-store";
  import { fetchFileContent } from '$lib/api';
  import Folder from 'lucide-svelte/icons/folder';
  import File from 'lucide-svelte/icons/file';

  export let tree;
  const toggleExpansion = () => {
    tree.expanded = !tree.expanded;
    openFile(tree);
  };

  function trimString(str: string, maxLength: number): string {
      if (str.length <= maxLength) {
          return str;
      }
      return str.slice(0, maxLength - 3) + '...';
  }

  async function openFile(file: TreeNode): Promise<void> {
    if (!file.expanded) {
      try {
        const encodedFilePath = encodeURIComponent(file.fullPath || '');
        console.log(encodedFilePath);
        const data = await fetchFileContent(encodedFilePath);
        console.log(data);
        updateCode({
          code: data.content || "",
          language: data.language.toLowerCase() || "typescript",
          path: file.fullPath || "",
          fileName: file.label,
          lastModified: new Date().toISOString(),
          size: 0,
          isDirty: false,
        });
      } catch (error) {
        console.error("Error fetching file content:", error);
      }
    }
  }
</script>

<ul class="pl-3">
  <li>
    {#if tree.children}
      <button
        on:click={toggleExpansion}
        class="w-full text-left hover:bg-neutral-700 rounded cursor-pointer p-2 flex items-center"
        class:arrowDown={tree.expanded}
      >
        <Folder class="mr-2" size={18} />
        <span>
          {trimString(tree.label, 20)}
        </span>
      </button>
      <div>
        {#if tree.expanded}
          {#each tree.children as child}
            <svelte:self tree={child} on:toggle />
          {/each}
        {/if}
      </div>
    {:else}
      <button
        class="w-full text-left hover:bg-neutral-700 rounded cursor-pointer p-2 flex items-center"
        on:click={() => openFile(tree)}
      >
        <File class="mr-2" size={18} />
        {trimString(tree.label, 20)}
      </button>
    {/if}
  </li>
</ul>
