<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import PlusIcon from 'lucide-svelte/icons/folder-plus' 
  import FileTree from './FileTree.svelte';

  const dispatch = createEventDispatcher();

  let isSidebarOpen: boolean = true;
  let currentProject: string = "Cody";
  let projects: string[] = ["Cody", "Svelte Starter"];

  function toggleSidebar(): void {
    isSidebarOpen = !isSidebarOpen;
  }

  function switchProject(event: CustomEvent<string>): void {
    currentProject = event.detail;
  }

  function addProject(event: CustomEvent<string>): void {
    const newProjectName = event.detail;
    projects = [...projects, newProjectName];
    switchProject({ detail: newProjectName } as CustomEvent<string>);
  }

  function openCreateFileDialog(): void {
    dispatch('createFile');
  }
</script>

<aside
  class={`w-64 bg-neutral-800 p-4 transition-transform duration-300 ease-in-out flex flex-col ${
    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
  } md:translate-x-0`}
>
  <div class="flex-grow">
    <button on:click={toggleSidebar} class="font-bold">
      <span class="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
        Tukang Ngooding
      </span>
    </button>
    <FileTree />
  </div>
  <div class="mt-auto">
      <button
        on:click={openCreateFileDialog}
        class="px-3 py-2 bg-neutral-700 text-white rounded hover:bg-neutral-600/50 focus:outline-none text-sm flex items-center gap-2 w-full"
      >
        <PlusIcon class="size-4"/>
        Create New File
      </button>
  </div>
</aside>
