<script lang="ts">
  import { onMount } from "svelte";
  import Fuse from "fuse.js";
  import { fetchFileTree } from "$lib/api";
  import { filePaths } from "$lib/file-path-store";
  import Folder from "lucide-svelte/icons/folder";
  import File from "lucide-svelte/icons/file";
  import X from "lucide-svelte/icons/x";

  interface FileItem {
    name: string;
    type: "folder" | "file";
  }

  export let open = false;
  export let submitLabel: string | undefined = undefined;

  let allFiles: FileItem[] = [];

  let selectedFiles: Set<string> = new Set();
  let searchQuery = "";
  let fuse: Fuse<FileItem>;
  let displayedFiles: FileItem[] = [];
  let loading = true;
  let searchInput: HTMLInputElement;
  let selectedIndex = -1;

  onMount(() => {
    fetchFileTree().then((data) => {
      if (data) {
        loading = false;
        allFiles = data.files.filter((file) => file.type === "file");
        const options = {
          keys: ["name"],
          threshold: 0.4,
        };
        fuse = new Fuse(allFiles, options);

        // Initialize selectedFiles with file paths from filePaths store
        selectedFiles = new Set($filePaths);

        // Sort allFiles to put selected files first
        sortAllFiles();

        // Initialize displayedFiles
        displayedFiles = allFiles;
      }
    });
  });

  function sortAllFiles() {
    allFiles.sort((a, b) => {
      const aSelected = selectedFiles.has(a.name);
      const bSelected = selectedFiles.has(b.name);
      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;
      return 0;
    });
  }

  function handleSearch() {
    if (searchQuery.trim() === "") {
      displayedFiles = allFiles;
    } else {
      displayedFiles = fuse.search(searchQuery).map((result) => result.item);
    }
    selectedIndex = -1;
  }

  function toggleFileSelection(file: FileItem): void {
    if (file.type === "file") {
      if (selectedFiles.has(file.name)) {
        selectedFiles.delete(file.name);
      } else {
        selectedFiles.add(file.name);
      }
      selectedFiles = new Set(selectedFiles);
      sortAllFiles();
      displayedFiles = [...allFiles];
    }
  }

  function confirmSelection(): void {
    if (selectedFiles.size > 0) {
      filePaths.set(Array.from(selectedFiles));
      open = false;
    }
  }

  function closeDialog(): void {
    open = false;
  }

  function handleInputKeydown(event: KeyboardEvent) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      selectedIndex = (selectedIndex + 1) % displayedFiles.length;
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      selectedIndex =
        (selectedIndex - 1 + displayedFiles.length) % displayedFiles.length;
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (displayedFiles[selectedIndex]) {
        toggleFileSelection(displayedFiles[selectedIndex]);
      }
    }
  }

  function clearSelectedFiles(): void {
    selectedFiles.clear();
    selectedFiles = new Set(selectedFiles); // Trigger reactivity
    filePaths.set([]);
    sortAllFiles();
    displayedFiles = [...allFiles];
  }

  $: {
    if (searchQuery) {
      handleSearch();
    } else {
      displayedFiles = allFiles;
    }
  }

  $: if (open && searchInput) {
    setTimeout(() => searchInput.focus(), 0);
  }

  $: isFileSelected = (file: FileItem) => selectedFiles.has(file.name);

  // Subscribe to changes in filePaths store
  $: {
    selectedFiles = new Set($filePaths);
    if (allFiles.length > 0) {
      sortAllFiles();
      displayedFiles = [...allFiles];
    }
  }
</script>

<div
  class:hidden={!open}
  class:fixed={open}
  class="inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
>
  <div
    class="bg-neutral-800 rounded-xl shadow-lg w-full max-w-xl ring-1 ring-neutral-700/70"
  >
    <div class="flex items-center justify-between border-b border-neutral-700">
      <input
        bind:this={searchInput}
        class="w-full p-4 focus:outline-none bg-transparent text-sm"
        type="text"
        id="search_file"
        placeholder="Search files..."
        autocomplete="off"
        bind:value={searchQuery}
        on:keydown={handleInputKeydown}
      />
    </div>
    <div
      class="p-3 text-sm text-white h-[250px] overflow-y-auto scrollbar-hide"
    >
      {#if loading}
        <div class="flex justify-start items-center gap-3">
          <div
            class="animate-spin rounded-full size-6 border-4 border-dashed border-neutral-400"
          ></div>
          <span class="text-neutral-400">Loading...</span>
        </div>
      {/if}
      {#if allFiles.length > 0 && displayedFiles.length === 0}
        <div class="flex justify-start items-center gap-3">
          <span class="text-neutral-400">{searchQuery} not found</span>
        </div>
      {/if}
      <ul class="space-y-2">
        {#each displayedFiles as file, index (file.name)}
          <li>
            <button
              on:click={() => toggleFileSelection(file)}
              class="w-full text-left p-2 rounded-md hover:bg-neutral-700 focus:outline-none text-sm flex items-center"
              class:bg-neutral-700={selectedIndex === index}
              class:bg-orange-700={isFileSelected(file)}
            >
              {#if file.type === "folder"}
                <Folder class="w-4 h-4 mr-2" />
              {:else}
                <File class="w-4 h-4 mr-2" />
              {/if}
              {file.name}
            </button>
          </li>
        {/each}
      </ul>
    </div>
    <div
      class="flex justify-between p-3 border-t border-neutral-700 gap-2 text-sm"
    >
      <div class="flex items-center gap-2">
        {#if selectedFiles.size > 0}
          <button
            on:click={clearSelectedFiles}
            class="p-1 bg-neutral-700 text-white rounded hover:bg-neutral-600 focus:outline-none cursor-pointer flex items-center gap-1"
          >
            <X class="size-3" />
            <span class="text-xs">Clear</span>
          </button>
        {/if}
        <span class="text-neutral-400 text-xs"
          >Selected: {selectedFiles.size}</span
        >
      </div>
      <div>
        <button
          on:click={closeDialog}
          class="px-4 py-2 bg-neutral-700 text-white rounded hover:bg-neutral-600 focus:outline-none cursor-pointer mr-2"
        >
          Close
        </button>
        <button
          on:click={confirmSelection}
          class="px-4 py-2 bg-orange-800 text-white rounded hover:bg-orange-700 focus:outline-none cursor-pointer"
          disabled={selectedFiles.size === 0}
        >
          {submitLabel ? submitLabel : "Select"}
        </button>
      </div>
    </div>
  </div>
</div>
