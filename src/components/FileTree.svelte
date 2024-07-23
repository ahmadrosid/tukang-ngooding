<script lang="ts">
  import { onMount } from 'svelte';
  import Node from "./Node.svelte";
  import { transformToTreeNodes, type TreeNode } from '$lib/file_utils';
  import { fetchFileTree } from '$lib/api';

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
  }

  // init the tree state
  rebuildTree({ detail: { node: tree } }, false);

  onMount(async () => {
    const result = await fetchFileTree();
    if (result) {
      tree = {
        label: "/Users/ahmadrosid/github.com/ahmadrosid/Products/TukangKoding",
        children: transformToTreeNodes(result),
        expanded: true,
      };
    }
  });
</script>

<div class="py-2 -ml-4 text-sm max-h-[70vh] overflow-y-auto scrollbar-hide">
  <Node {tree} on:toggle={rebuildTree} />
</div>
