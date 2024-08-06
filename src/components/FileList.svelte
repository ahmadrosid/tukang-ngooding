<script lang="ts">
	export let loading: boolean;
	export let searchQuery: string;
	export let displayedFiles: FileItem[];
	export let selectedFile: FileItem | null;

	interface FileItem {
		name: string;
		type: 'folder' | 'file'
	}

	let selectedIndex = -1;

	function selectFile(file: FileItem, index: number): void {
		selectedFile = file;
		selectedIndex = index;
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'ArrowDown') {
			event.preventDefault();
			selectedIndex = (selectedIndex + 1) % displayedFiles.length;
			selectedFile = displayedFiles[selectedIndex];
		} else if (event.key === 'ArrowUp') {
			event.preventDefault();
			selectedIndex = (selectedIndex - 1 + displayedFiles.length) % displayedFiles.length;
			selectedFile = displayedFiles[selectedIndex];
		}
	}

</script>

<svelte:window on:keydown={handleKeydown} />

<div class="p-3 text-sm text-white h-[250px] overflow-y-auto scrollbar-hide">
	{#if loading}
		<div class="flex justify-start items-center gap-3">
			<div class="animate-spin rounded-full size-6 border-4 border-dashed border-neutral-400"></div>
			<span class="text-neutral-400">Loading...</span>
		</div>
	{/if}
	{#if displayedFiles.length === 0 && !loading}
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
