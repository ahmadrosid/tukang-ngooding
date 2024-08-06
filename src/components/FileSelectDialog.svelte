<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import Fuse from 'fuse.js';
  	import { fetchFileTree } from '$lib/api';
	import { projectRoot } from '$lib/project-root-store';
	let currentRoot: string;

	interface FileItem {
		name: string;
		type: 'folder' | 'file'
	}

	const dispatch = createEventDispatcher<{
		fileSelected: FileItem;
		close: void;
	}>();
  
	let open = false;
	export let submitLabel: string | undefined = undefined;

	let allFiles: FileItem[] = [];
  
	let selectedFile: FileItem | null = null;
	let searchQuery = '';
	let fuse: Fuse<FileItem>;
	let displayedFiles: FileItem[] = allFiles;
	let loading = true;
	let searchInput: HTMLInputElement;
	let selectedIndex = -1;

	onMount(() => {
		window.addEventListener('keydown', handleKeydown);
		return () => {
			window.removeEventListener('keydown', handleKeydown);
		};
	});

	function handleSearch() {
		if (searchQuery.trim() === '') {
			displayedFiles = allFiles;
		} else {
			displayedFiles = fuse.search(searchQuery).map(result => result.item);
		}
		selectedIndex = -1;
	}
  
	function selectFile(file: FileItem, index: number): void {
		selectedFile = file;
		selectedIndex = index;
	}
  
	function confirmSelection(): void {
		if (selectedFile) {
			dispatch('fileSelected', selectedFile);
			open = false;
		}
	}
  
	function closeDialog(): void {
		dispatch('close');
		open = false;
	}

	function handleKeydown(event: KeyboardEvent) {
        if ((event.key === "j" || event.key === "p") && (event.metaKey || event.ctrlKey)) {
            open = true;
            event.preventDefault();
        }

        if (event.key === "Escape") {
            open = false;
        }
	}

	function handleInputKeydown(event: KeyboardEvent) {        
		if (event.key === 'ArrowDown') {
			event.preventDefault();
			selectedIndex = (selectedIndex + 1) % displayedFiles.length;
			selectedFile = displayedFiles[selectedIndex];
		} else if (event.key === 'ArrowUp') {
			event.preventDefault();
			selectedIndex = (selectedIndex - 1 + displayedFiles.length) % displayedFiles.length;
			selectedFile = displayedFiles[selectedIndex];
		} else if (event.key === 'Enter') {
			if (selectedFile) {
			    event.preventDefault();
				confirmSelection();
			}
		}
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

	$: if ($projectRoot !== currentRoot) {
		currentRoot = $projectRoot;
		if (typeof window !== 'undefined') {
			fetchFileTree().then(data => {
				if (data) {
					loading = false;
					allFiles = data.files.filter((file) => file.type === 'file');
					const options = {
						keys: ['name'],
						threshold: 0.4
					};
					fuse = new Fuse(allFiles, options);
					displayedFiles = allFiles;
					selectedIndex = -1;
				}
			});
		}
	}
</script>

<div class:hidden={!open} class:fixed={open} class="inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
	<div class="bg-neutral-800 rounded-xl shadow-lg w-full max-w-xl ring-1 ring-neutral-700/70">
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
		<div class="p-3 text-sm text-white h-[250px] overflow-y-auto scrollbar-hide">
			{#if loading}
				<div class="flex justify-start items-center gap-3">
					<div class="animate-spin rounded-full size-6 border-4 border-dashed border-neutral-400"></div>
					<span class="text-neutral-400">Loading...</span>
				</div>
			{/if}
			{#if allFiles.length > 0 && displayedFiles.length === 0}
				<div class="flex justify-start items-center gap-3">
					<span class="text-neutral-400">{searchQuery} not found</span>
				</div>
			{/if}
			<ul class="space-y-2">
				{#each displayedFiles as file, index}
					<li>
						<button
							on:click={() => selectFile(file, index)}
							class="w-full text-left p-2 rounded-md hover:bg-neutral-700 focus:outline-none text-sm"
							class:bg-neutral-700={selectedIndex === index}
						>
							{file.name}
						</button>
					</li>
				{/each}
			</ul>
		</div>
		<div class="flex justify-end p-3 border-t border-neutral-700 gap-2 text-sm">
			<button
				on:click={closeDialog}
				class="px-4 py-2 bg-neutral-700 text-white rounded hover:bg-neutral-600 focus:outline-none cursor-pointer"
			>
				Close
			</button>
			<button
				on:click={confirmSelection}
				class="px-4 py-2 bg-neutral-700 text-white rounded hover:bg-neutral-600 focus:outline-none cursor-pointer"
				disabled={!selectedFile}
			>
				{submitLabel ? submitLabel : 'Select'}
			</button>
		</div>
	</div>
</div>