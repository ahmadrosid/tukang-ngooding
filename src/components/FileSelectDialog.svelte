<script lang="ts">
	import { onMount } from 'svelte';
	import Fuse from 'fuse.js';
	import { fetchFileTree } from '$lib/api';
	import { projectRoot } from '$lib/project-root-store';
	import FileList from './FileList.svelte';

	let currentRoot: string;

	interface FileItem {
		name: string;
		type: 'folder' | 'file'
	}
	
	let { submitLabel, fileSelected, close } = $props()
	let open = $state(false);
	let allFiles: FileItem[] = $state([]);
	let selectedFile: FileItem | null = $state(null);
	let searchQuery = $state('');
	let displayedFiles: FileItem[] = $state([]);
	let loading = $state(true);
	let fuse: Fuse<FileItem>;
	let searchInput: HTMLInputElement;

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
	}
  
	function confirmSelection(): void {
		if (selectedFile) {
			fileSelected(selectedFile);
			open = false;
		}
	}
  
	function closeDialog(): void {
		close();
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
		if (event.key === 'Enter' && selectedFile) {
			event.preventDefault();
			confirmSelection();
		}
	}

	// $: {
	// 	if (searchQuery) {
	// 		handleSearch();
	// 	} else {
	// 		displayedFiles = allFiles;
	// 	}
	// }

	$effect(() => {
		if (searchQuery) {
			handleSearch();
		} else {
			displayedFiles = allFiles;
		}
	})

	$effect(() => {
		if (open && searchInput) {
			setTimeout(() => searchInput.focus(), 0);
		}
	});

	$effect(() => {
		if ($projectRoot !== currentRoot) {
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
					}
				});
			}
		}
	});
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
				onkeydown={handleInputKeydown}
			/>
		</div>
		<FileList 
			{loading}
			{searchQuery}
			{displayedFiles}
			{selectedFile}
		/>
		<div class="flex justify-end p-3 border-t border-neutral-700 gap-2 text-sm">
			<button
				onclick={closeDialog}
				class="px-4 py-2 bg-neutral-700 text-white rounded hover:bg-neutral-600 focus:outline-none cursor-pointer"
			>
				Close
			</button>
			<button
				onclick={confirmSelection}
				class="px-4 py-2 bg-neutral-700 text-white rounded hover:bg-neutral-600 focus:outline-none cursor-pointer"
				disabled={!selectedFile}
			>
				{submitLabel ? submitLabel : 'Select'}
			</button>
		</div>
	</div>
</div>
