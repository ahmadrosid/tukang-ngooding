<script lang="ts">
  import { onMount } from 'svelte';
  import Node from "./Node.svelte";
  import { transformToTreeNodes, type TreeNode } from '$lib/file_utils';

  let tree: TreeNode = {
    label: "root",
    children: [],
    expanded: true,
  };

  async function fetchFileTree(folder: string = "./"): Promise<void> {
    try {
      const response = await fetch(`/api/files?folder=${folder}`);
      const data = await response.json();
      tree = {
        label: "root",
        children: transformToTreeNodes(data),
        expanded: true,
      };
    } catch (error) {
      console.error("Error fetching file tree:", error);
    }
  }

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

  function rebuildChildren(node: TreeNode, checkAsParent: boolean = true): void {
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
        const haveCheckedOrIndetermine = parent.children?.some(
          (c) => !!c.checked || c.indeterminate
        ) ?? false;
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
    // see console the tree state when there's a state changed
    // console.log(tree)
  }

  // init the tree state
  rebuildTree({ detail: { node: tree } }, false);

  onMount(() => {
    fetchFileTree();
  });
</script>

<div class="py-2 -ml-4 text-sm">
  <Node {tree} on:toggle={rebuildTree} />
</div>
