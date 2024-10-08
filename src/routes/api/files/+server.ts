import { json } from "@sveltejs/kit";
import path from "path";
import * as globby from "globby";
import { promises as fs } from "fs";
import { resolveAndValidateFilePath } from "$lib/+serverUtils";

export async function GET(request) {
  const url = new URL(request.url);
  const folderName = url.searchParams.get("folder");

  if (!folderName) {
    return json(
      {
        error: "Folder name is required",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  try {
    const folderPath = await resolveAndValidateFilePath(folderName);

    const paths = await globby.globby(['**/*'], {
      cwd: folderPath,
      gitignore: true,
      dot: false,
      onlyFiles: false
    });
    
    const fileList = await Promise.all(paths.map(async (item) => {
      const fullPath = path.join(folderPath, item);
      const stats = await fs.stat(fullPath);
      return {
        name: item,
        type: stats.isDirectory() ? 'folder' : 'file'
      };
    }));

    return json({
      rootFolder: path.basename(folderPath),
      files: fileList
    });
  } catch (error: any) {
    return json({ error: error.message });
  }
}
