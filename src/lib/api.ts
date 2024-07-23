interface FileResponse {
  files: {
    name: string;
    type: "file" | "folder";
  }[];
}

export async function fetchFileTree(
  folder: string = "./"
): Promise<FileResponse | undefined> {
  try {
    const response = await fetch(`/api/files?folder=${folder}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching file tree:", error);
  }
}
