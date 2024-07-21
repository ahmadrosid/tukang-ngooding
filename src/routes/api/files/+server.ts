import fs from "fs";
import path from "path";
import { json } from "@sveltejs/kit";

export function GET(request) {
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
    const folderPath = path.resolve(process.cwd(), folderName);
    const items = fs.readdirSync(folderPath, { withFileTypes: true });
    
    const fileList = items.map(item => ({
      name: item.name,
      type: item.isDirectory() ? 'folder' : 'file'
    }));

    return json({ files: fileList });
  } catch (error: any) {
    return json({ error: error.message });
  }
}