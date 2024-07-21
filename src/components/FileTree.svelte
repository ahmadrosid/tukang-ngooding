<script lang="ts">
  import { onMount } from "svelte";
  import { updateCode } from "../lib/code_store";
  import { mapApiResponseToFileTree } from "$lib/file_utils";

  interface FileTreeItem {
    name: string;
    type: "file" | "folder";
    isOpen?: boolean;
    children?: FileTreeItem[];
  }

  let fileTree: FileTreeItem[] = [];

  async function fetchFileTree(folder: string = "./"): Promise<void> {
    try {
      const response = await fetch(`/api/files?folder=${folder}`);
      const data = await response.json();
      fileTree = mapApiResponseToFileTree(data);
      console.log({ fileTree });
    } catch (error) {
      console.error("Error fetching file tree:", error);
    }
  }

  async function toggleFolder(folder: FileTreeItem): Promise<void> {
    if (folder.type === "folder") {
      if (
        !folder.isOpen &&
        (!folder.children || folder.children.length === 0)
      ) {
        await fetchFileTree(folder.name);
        const folderContents = fileTree.find(
          (item) => item.name === folder.name
        );
        if (folderContents && folderContents.children) {
          folder.children = folderContents.children;
        }
      }
      folder.isOpen = !folder.isOpen;
      fileTree = [...fileTree];
    }
  }

  async function openFile(file: FileTreeItem): Promise<void> {
    if (file.type === "file") {
      try {
        const response = await fetch(`/api/files/fetch?file=${file.name}`);
        const data = await response.json();
        updateCode({
          code: data.content || "",
          language: data.language.toLowerCase() || "typescript",
          path: file.name,
          fileName: file.name,
          lastModified: new Date().toISOString(),
          size: 0,
          isDirty: false,
        });
      } catch (error) {
        console.error("Error fetching file content:", error);
      }
    }
  }

  onMount(() => {
    fetchFileTree();
  });
</script>

<nav class="mt-2 text-sm w-[220px] max-h-[80vh] overflow-y-auto scrollbar-hide">
  <ul class="space-y-1">
    {#each fileTree as item}
      <li>
        {#if item.type === "folder"}
          <button
            class="flex items-center cursor-pointer hover:bg-neutral-700 p-2 rounded w-full"
            on:click={() => toggleFolder(item)}
          >
            <span class="mr-2">{item.isOpen ? "📂" : "📁"}</span>
            <span>{item.name}</span>
          </button>
          {#if item.isOpen && item.children}
            <ul class="ml-4 mt-1 space-y-1">
              {#each item.children as child}
                <li
                >
                  <button
                    class="flex items-center py-2 hover:bg-neutral-700 rounded cursor-pointer w-full"
                    on:click={() => {
                      toggleFolder(child);
                      openFile({
                        ...child,
                        name: `${item.name}/${child.name}`,
                      });
                    }}
                  >
                    <span class="mr-2"
                      >{child.type === "folder" ? "📁" : "📄"}</span
                    >
                    <span>{child.name}</span>
                  </button>
                  {#if child.isOpen && child.children}
                    <ul class="ml-4 mt-1 space-y-1">
                      {#each child.children as childChildren}
                        <li
                          class="flex items-center py-2 hover:bg-neutral-700 rounded cursor-pointer"
                        >
                          <button
                            on:click={() =>
                              openFile({
                                ...childChildren,
                                name: `${item.name}/${child.name}/${childChildren.name}`,
                              })}
                          >
                            <span class="mr-2"
                              >{childChildren.type === "folder"
                                ? "📁"
                                : "📄"}</span
                            >
                            <span>{childChildren.name}</span>
                          </button>
                        </li>
                      {/each}
                    </ul>
                  {/if}
                </li>
              {/each}
            </ul>
          {/if}
        {:else}
          <button
            class="w-full flex items-center p-2 hover:bg-neutral-700 rounded cursor-pointer"
            on:click={() => openFile(item)}
          >
            <span class="mr-2">📄</span>
            <span>{item.name}</span>
          </button>
        {/if}
      </li>
    {/each}
  </ul>
</nav>
