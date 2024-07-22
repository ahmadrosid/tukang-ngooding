interface FileData {
  name: string;
  type: string;
}

interface InputData {
  files: FileData[];
}

export interface TreeNode {
  label: string;
  fullPath?: string;
  children?: TreeNode[];
  checked?: boolean;
  indeterminate?: boolean;
  expanded?: boolean;
}

export function transformToTreeNodes(data: InputData): TreeNode[] {
  const root: TreeNode = { label: 'root', fullPath: '', children: [] };

  data.files.forEach(file => {
    const parts = file.name.split('/');
    let currentNode = root;
    let currentPath = '';

    parts.forEach((part, index) => {
      currentPath += (index > 0 ? '/' : '') + part;
      const isLastPart = index === parts.length - 1;
      let childNode = currentNode.children?.find(child => child.label === part);

      if (!childNode) {
        childNode = { label: part, fullPath: currentPath };
        if (file.type === 'folder' || !isLastPart) {
          childNode.children = [];
        }
        currentNode.children = currentNode.children || [];
        currentNode.children.push(childNode);
      }

      currentNode = childNode;
    });
  });

  // Helper function to sort nodes
  const sortNodes = (nodes: TreeNode[]): TreeNode[] => {
    return nodes.sort((a, b) => {
      // If both are folders or both are files, sort alphabetically
      if ((a.children && b.children) || (!a.children && !b.children)) {
        return a.label.localeCompare(b.label);
      }
      // If a is a folder and b is not, a comes first
      if (a.children && !b.children) return -1;
      // If b is a folder and a is not, b comes first
      if (!a.children && b.children) return 1;
      // This should never happen, but TypeScript likes it
      return 0;
    });
  };

  // Recursive function to sort all levels
  const sortRecursively = (node: TreeNode) => {
    if (node.children) {
      node.children = sortNodes(node.children);
      node.children.forEach(sortRecursively);
    }
  };

  // Sort the root children
  root.children = sortNodes(root.children || []);
  // Sort all other levels
  root.children.forEach(sortRecursively);

  return root.children || [];
}
