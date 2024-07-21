interface FileTreeItem {
  name: string;
  type: "file" | "folder";
  isOpen?: boolean;
  children?: FileTreeItem[];
}

interface ApiResponseItem {
  name: string;
  type: string;
}

export function mapApiResponseToFileTree(apiResponse: {
  files: ApiResponseItem[];
}): FileTreeItem[] {
  const fileTree: FileTreeItem[] = [];
  const folderMap: { [key: string]: FileTreeItem } = {};

  const sortedItems = apiResponse.files.sort((a, b) => {
    if (a.type === 'folder' && b.type !== 'folder') return -1;
    if (a.type !== 'folder' && b.type === 'folder') return 1;
    return a.name.localeCompare(b.name);
  });
  
  // First pass: create all items and populate folderMap
  sortedItems.forEach((item: ApiResponseItem) => {
    const pathParts = item.name.split("/");
    const fileName = pathParts.pop() || "";
    const folderPath = pathParts.join("/");

    const newItem: FileTreeItem = {
      name: fileName,
      type: item.type as "file" | "folder",
      isOpen: false,
      children: item.type === "folder" ? [] : undefined,
    };

    if (folderPath) {
      if (!folderMap[folderPath]) {
        folderMap[folderPath] = {
          name: folderPath,
          type: "folder",
          isOpen: false,
          children: [],
        };
      }
      folderMap[folderPath].children?.push(newItem);
    } else {
      fileTree.push(newItem);
    }

    if (item.type === "folder") {
      folderMap[item.name] = newItem;
    }
  });

  // Second pass: nest folders properly
  Object.keys(folderMap).forEach((folderPath) => {
    const pathParts = folderPath.split("/");
    if (pathParts.length > 1) {
      const parentFolderPath = pathParts.slice(0, -1).join("/");
      const parentFolder = folderMap[parentFolderPath];
      if (parentFolder && parentFolder.children) {
        parentFolder.children = parentFolder.children.filter(
          (child) => child.name !== pathParts[pathParts.length - 1]
        );
        parentFolder.children.push(folderMap[folderPath]);
      }
    }
  });

  return fileTree; // Explicitly return the fileTree
}
