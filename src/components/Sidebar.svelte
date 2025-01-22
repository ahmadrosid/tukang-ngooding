<script lang="ts">
  import FilePlusIcon from "lucide-svelte/icons/file-plus";
  import SettingsIcon from "lucide-svelte/icons/settings";
  import GithubIcon from "lucide-svelte/icons/github"; 
  import FileTree from "./FileTree.svelte";

  let { onCreateFile, showSettings } = $props();

  let isSidebarOpen: boolean = $state(true);

  function toggleSidebar(): void {
    isSidebarOpen = !isSidebarOpen;
  }

  function openCreateFileDialog(): void {
    onCreateFile();
  }
</script>

<aside
  class={`w-64 bg-neutral-800 p-4 transition-transform duration-300 ease-in-out flex flex-col ${
    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
  } md:translate-x-0`}
>
  <div class="flex-grow">
    <div class="flex items-center justify-between">
      <button onclick={toggleSidebar} class="font-bold flex items-center gap-2">
        <span
          class="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500"
        >
          Tukang Ngooding
        </span>
      </button>
      <a href="https://github.com/ahmadrosid/tukang-ngooding" target="_blank" rel="noopener noreferrer">
        <GithubIcon class="size-4" />
      </a>
    </div>
    <FileTree />
  </div>
  <div class="mt-auto flex items-center gap-2">
    <button
      onclick={openCreateFileDialog}
      class="px-3 py-2 bg-neutral-700 text-white rounded hover:bg-neutral-600/50 focus:outline-none text-sm flex items-center gap-2 flex-grow"
    >
      <FilePlusIcon class="size-4" />
      <span class="text-xs">New File</span>
    </button>
    <div class="relative">
      <button
        onclick={() => (showSettings = !showSettings)}
        class="p-2 bg-neutral-700 text-white rounded hover:bg-neutral-600/50 focus:outline-none"
      >
        <SettingsIcon class="size-4" />
      </button>
    </div>
  </div>
</aside>
