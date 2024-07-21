<script lang="ts">
  import { mapApiResponseToFileTree } from "$lib/file_utils";
  import { onMount } from "svelte";
  import { updateCode } from '../lib/code_store';

  interface FileTreeItem {
    name: string;
    type: "file" | "folder";
    isOpen?: boolean;
    children?: FileTreeItem[];
  }

  let isSidebarOpen: boolean = true;
  let currentProject: string = "Cody";
  let newProjectName: string = "";
  let isAddingProject: boolean = false;
  let fileTree: FileTreeItem[] = [];

  function toggleSidebar(): void {
    isSidebarOpen = !isSidebarOpen;
  }

  let projects: string[] = ["Cody", "Svelte Starter"];

  async function fetchFileTree(folder: string = "./"): Promise<void> {
    try {
      const response = await fetch(`/api/files?folder=${folder}`);
      const data = await response.json();
      fileTree = mapApiResponseToFileTree(data);
    } catch (error) {
      console.error("Error fetching file tree:", error);
    }
  }

  async function toggleFolder(folder: FileTreeItem): Promise<void> {
    if (folder.type === "folder") {
      if (!folder.isOpen && (!folder.children || folder.children.length === 0)) {
        // Fetch children if the folder is being opened for the first time
        await fetchFileTree(folder.name);
        const folderContents = fileTree.find(item => item.name === folder.name);
        if (folderContents && folderContents.children) {
          folder.children = folderContents.children;
        }
      }
      folder.isOpen = !folder.isOpen;
      fileTree = [...fileTree];
    }
  }

  function switchProject(project: string): void {
    currentProject = project;
    fetchFileTree(); // Reload the file tree for the new project
  }

  function startAddingProject(): void {
    isAddingProject = true;
    newProjectName = "";
  }

  function addProject(): void {
    if (newProjectName.trim()) {
      projects = [...projects, newProjectName.trim()];
      switchProject(newProjectName.trim());
      isAddingProject = false;
    }
  }

  function cancelAddProject(): void {
    isAddingProject = false;
    newProjectName = "";
  }

  async function openFile(file: FileTreeItem): Promise<void> {
    if (file.type === "file") {
      try {
        const response = await fetch(`/api/files/fetch?file=${file.name}`);
        const data = await response.json();
        updateCode({
          code: data.content || '',
          language: data.language.toLowerCase() || 'typescript',
          path: file.name,
          fileName: file.name,
          lastModified: new Date().toISOString(),
          size: 0,
          isDirty: false
        });
      } catch (error) {
        console.error("Error fetching file content:", error);
      }
    }
  }

  onMount(() => {
    fetchFileTree();

    const handleResize = (): void => {
      if (window.innerWidth <= 768) {
        isSidebarOpen = false;
      } else {
        isSidebarOpen = true;
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });
</script>

<aside
  class={`w-64 bg-neutral-800 p-4 transition-transform duration-300 ease-in-out flex flex-col ${
    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
  } md:translate-x-0`}
>
  <div class="flex-grow">
    <button on:click={toggleSidebar} class="font-bold p-2">
      <span class="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
        Tukang Koding
      </span>
    </button>
    <nav class="mt-2 text-sm w-[220px] max-h-[70vh] overflow-y-auto">
      <ul class="space-y-1">
        {#each fileTree as item}
          <li>
            {#if item.type === "folder"}
              <div
                role="button"
                class="flex items-center cursor-pointer hover:bg-neutral-700 p-2 rounded"
                on:click={() => toggleFolder(item)}
              >
                <span class="mr-2">{item.isOpen ? "📂" : "📁"}</span>
                <span>{item.name}</span>
              </div>
              {#if item.isOpen && item.children}
                <ul class="ml-4 mt-1 space-y-1">
                  {#each item.children as child}
                    <li class="flex items-center p-2 hover:bg-neutral-700 rounded">
                      <span class="mr-2">{child.type === "folder" ? "📁" : "📄"}</span>
                      <span>{child.name}</span>
                    </li>
                  {/each}
                </ul>
              {/if}
            {:else}
              <button class="w-full flex items-center p-2 hover:bg-neutral-700 rounded cursor-pointer" on:click={() => openFile(item)}>
                <span class="mr-2">📄</span>
                <span>{item.name}</span>
              </button>
            {/if}
          </li>
        {/each}
      </ul>
    </nav>
  </div>
  <div class="mt-auto">
    <h2 class="font-bold mb-2">Projects</h2>
    <ul class="space-y-1">
      {#each projects as project}
        <li>
          <button
            class={`w-full text-sm text-left p-2 rounded border border-neutral-700 truncate ${
              currentProject === project ? "bg-neutral-700" : "hover:bg-neutral-700"
            }`}
            on:click={() => switchProject(project)}
          >
            {project}
          </button>
        </li>
      {/each}
    </ul>
    {#if isAddingProject}
      <div class="mt-2">
        <input
          type="text"
          bind:value={newProjectName}
          placeholder="New project name"
          class="w-full p-2 bg-neutral-700 rounded text-white"
        />
        <div class="flex justify-between mt-2">
          <button
            on:click={addProject}
            class="px-2 py-1 bg-green-600 rounded hover:bg-green-700"
          >
            Add
          </button>
          <button
            on:click={cancelAddProject}
            class="px-2 py-1 bg-red-600 rounded hover:bg-red-700"
          >
            Cancel
          </button>
        </div>
      </div>
    {:else}
      <button
        on:click={startAddingProject}
        class="w-full mt-2 p-2 bg-orange-700 rounded hover:bg-blue-700 text-sm"
      >
        Add Project
      </button>
    {/if}
  </div>
</aside>