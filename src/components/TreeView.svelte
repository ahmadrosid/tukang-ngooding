<script module lang="ts">
	// Define the type for the expansion state
	type ExpansionState = {
		[key: string]: boolean;
	};
	
	// retain module scoped expansion state for each tree node
	const _expansionState: ExpansionState = {
		/* treeNodeId: expanded <boolean> */
	}
</script>
<script lang="ts">
    import Folder from 'lucide-svelte/icons/folder';
    import File from 'lucide-svelte/icons/file';

	let { tree } = $props();
	const {label, children} = tree

	let expanded = $state(_expansionState[label] || false)
    let arrowDown = $derived(expanded)

	const toggleExpansion = () => {
		expanded = _expansionState[label] = !expanded
	}
</script>

<ul class="pl-3">
	<li>
		{#if children}
			<button onclick={toggleExpansion} class="flex gap-2 items-center w-full hover:bg-neutral-700/50 rounded-md px-2 py-1.5">
                <Folder class="size-4" />
				<span>{label}</span>
			</button>
			{#if expanded}
				{#each children as child}
					<svelte:self tree={child} />
				{/each}
			{/if}
		{:else}
			<button class="flex gap-2 items-center w-full hover:bg-neutral-700/50 rounded-md px-2 py-1.5">
                <File class="size-4" />
				<span>{label}</span>
			</button>
		{/if}
	</li>
</ul>
