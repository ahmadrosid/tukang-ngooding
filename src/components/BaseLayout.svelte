<script lang="ts">
  import { onMount } from "svelte";

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

  function toggleSidebar(): void {
    isSidebarOpen = !isSidebarOpen;
  }

  let projects: string[] = ["Cody", "Svelte Starter"];
  let fileTree: FileTreeItem[] = [
    { name: "index.html", type: "file" },
    { name: "styles.css", type: "file" },
    {
      name: "js",
      type: "folder",
      isOpen: false,
      children: [
        { name: "main.js", type: "file" },
        { name: "utils.js", type: "file" },
      ],
    },
  ];

  function toggleFolder(folder: FileTreeItem): void {
    if (folder.type === "folder") {
      folder.isOpen = !folder.isOpen;
      fileTree = [...fileTree];
    }
  }

  function switchProject(project: string): void {
    currentProject = project;
    // Here you would typically load the file tree for the selected project
    // For this example, we'll just use the same file tree for all projects
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

  onMount(() => {
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

<div class="flex h-screen text-white font-mono">
  <aside
    class={`w-64 bg-neutral-800 p-4 transition-transform duration-300 ease-in-out flex flex-col ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
  >
    <div class="flex-grow">
      <button on:click={toggleSidebar} class="font-bold p-2">
        <span class="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
          Tukang Koding
        </span>
      </button>
      <nav class="mt-2 text-sm w-[200px]">
        <ul class="space-y-1">
          {#each fileTree as item}
            <li>
              {#if item.type === "folder"}
                <div
                  class="flex items-center cursor-pointer hover:bg-neutral-700 p-2 rounded"
                  on:click={() => toggleFolder(item)}
                >
                  <span class="mr-2">{item.isOpen ? "📂" : "📁"}</span>
                  <span>{item.name}</span>
                </div>
                {#if item.isOpen}
                  <ul class="ml-4 mt-1 space-y-1">
                    {#each item.children as child}
                      <li
                        class="flex items-center p-2 hover:bg-neutral-700 rounded"
                      >
                        <span class="mr-2">📄</span>
                        <span>{child.name}</span>
                      </li>
                    {/each}
                  </ul>
                {/if}
              {:else}
                <div class="flex items-center p-2 hover:bg-neutral-700 rounded">
                  <span class="mr-2">📄</span>
                  <span>{item.name}</span>
                </div>
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
              class={`w-full text-sm text-left p-2 rounded border border-neutral-700 truncate ${currentProject === project ? "bg-neutral-700" : "hover:bg-neutral-700"}`}
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
          class="w-full mt-2 p-2 bg-blue-600 rounded hover:bg-blue-700 text-sm"
        >
          Add Project
        </button>
      {/if}
    </div>
  </aside>
  <main class="flex-grow overflow-y-auto bg-neutral-900 relative">
    <div class="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" style="background-position: 10px 10px;"></div>
    <slot></slot>
  </main>
</div>
