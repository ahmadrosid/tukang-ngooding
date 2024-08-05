<script lang="ts">
  import { onMount } from "svelte";
  import Node from "./Node.svelte";
  import { transformToTreeNodes, type TreeNode } from "$lib/file_utils";
  import { fetchFileTree } from "$lib/api";
  import { projectRoot } from '$lib/store';

  let error = "";
  let tree: TreeNode = {
    label: "root",
    children: [],
    expanded: true,
  };

  const treeMap: { [key: string]: TreeNode } = {};

  function initTreeMap(node: TreeNode): void {
    if (node.children) {
      for (const child of node.children) {
        treeMap[child.label] = node;
        initTreeMap(child);
      }
    }
  }
  initTreeMap(tree);

  function rebuildChildren(
    node: TreeNode,
    checkAsParent: boolean = true
  ): void {
    if (node.children) {
      for (const child of node.children) {
        if (checkAsParent) child.checked = !!node.checked;
        rebuildChildren(child, checkAsParent);
      }
      node.indeterminate =
        node.children.some((c) => c.indeterminate) ||
        (node.children.some((c) => !!c.checked) &&
          node.children.some((c) => !c.checked));
    }
  }

  interface ToggleEvent {
    detail: {
      node: TreeNode;
    };
  }

  function rebuildTree(e: ToggleEvent, checkAsParent: boolean = true): void {
    const node = e.detail.node;
    let parent = treeMap[node.label];
    rebuildChildren(node, checkAsParent);
    while (parent) {
      const allCheck = parent.children?.every((c) => !!c.checked) ?? false;
      if (allCheck) {
        parent.indeterminate = false;
        parent.checked = true;
      } else {
        const haveCheckedOrIndetermine =
          parent.children?.some((c) => !!c.checked || c.indeterminate) ?? false;
        if (haveCheckedOrIndetermine) {
          parent.indeterminate = true;
        } else {
          parent.indeterminate = false;
        }
        parent.checked = false;
      }

      parent = treeMap[parent.label];
    }
    tree = tree;
  }

  // init the tree state
  rebuildTree({ detail: { node: tree } }, false);

  async function refreshFileTree(root: string) {
    try {
        const result = await fetchFileTree(root);
        if (result) {
            tree = {
                label: result.rootFolder,
                children: transformToTreeNodes(result),
                expanded: true,
            };
            error = "";
            initTreeMap(tree);
            rebuildTree({ detail: { node: tree } }, false);
        } else {
            error = "No files found."
        }
    } catch (e) {
        error = "Error fetching file tree.";
        console.error("Error fetching file tree:", e);
    }
  }

  let currentRoot: string;

  onMount(() => {
    currentRoot = $projectRoot;
    refreshFileTree(currentRoot);
  });

  $: if ($projectRoot !== currentRoot) {
    currentRoot = $projectRoot;
    if (typeof window !== 'undefined') {
      refreshFileTree(currentRoot);
    }
  }
</script>

<div class="py-2 -ml-4 text-sm max-h-[70vh] overflow-y-auto scrollbar-hide">
  {#if error}
    <p class="text-red-500 px-4">{error}</p>
  {:else}
    <Node {tree} on:toggle={rebuildTree} />
  {/if}
</div>
