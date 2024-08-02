interface FileResponse {
  rootFolder: string;
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

export async function fetchFileContent(filePath: string): Promise<any> {
  try {
    const encodedFilePath = encodeURIComponent(filePath);
    const response = await fetch(`/api/files/fetch?file=${encodedFilePath}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching file content:", error);
    throw error;
  }
}

export async function createFile(fileName: string, content: string): Promise<any> {
  try {
    const response = await fetch("/api/files/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fileName, content }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create file");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating file:", error);
    throw error;
  }
}

export async function updateFile(filePath: string, content: string): Promise<any> {
  try {
    const response = await fetch("/api/files/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ filePath, content }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to update file");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating file:", error);
    throw error;
  }
}