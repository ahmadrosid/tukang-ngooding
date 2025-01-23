<script lang="ts">
  // import { transformToTreeNodes, type TreeNode } from "$lib/file-utils";
  // import { fetchFileTree } from "$lib/api";
  // import { projectRoot } from '$lib/project-root-store';

  // let error = $state("");
  // let tree: TreeNode = $state({
  //   label: "root",
  //   children: [],
  //   expanded: true,
  // });

  // async function getFileTree(root: string) {
  //   try {
  //       const result = await fetchFileTree(root);
  //       if (result) {
  //           tree = {
  //               label: result.rootFolder,
  //               children: transformToTreeNodes(result),
  //               expanded: true,
  //           };
  //           error = "";
  //       } else {
  //           error = "No files found."
  //       }
  //   } catch (e) {
  //       error = "Error fetching file tree.";
  //       console.error("Error fetching file tree:", e);
  //   }
  // }

  import TreeView from './TreeView.svelte'

const tree = {
  label: "USA", children: [
    {label: "Florida", children: [
      {label: "Jacksonville"},
      {label: "Orlando", children: [
        {label: "Disney World"},
        {label: "Universal Studio"},
        {label: "Sea World"},
      ]},
      {label: "Miami"},
    ]},
    {label: "California", children: [
      {label: "San Francisco"},
      {label: "Los Angeles"},
      {label: "Sacramento"},
    ]},
  ],
}
</script>

<TreeView {tree} />
