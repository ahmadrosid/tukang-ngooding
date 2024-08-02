import { json } from "@sveltejs/kit";
import path from "path";
import { promises as fs } from "fs";
import { env } from "$env/dynamic/private";
import { supportedExtensions } from "$lib/+serverUtils.js";

const currentDirectory: string = env.CURRENT_DIRECTORY || "";

export async function GET(request) {
  const url = new URL(request.url);
  const filePath = url.searchParams.get("file");

  if (!filePath) {
    return json(
      { error: "File path is required" },
      { status: 400 }
    );
  }

  try {
    const encodedFilePath = decodeURIComponent(filePath);
    const fullPath = path.resolve(currentDirectory, encodedFilePath);
    
    // Check if the file exists
    await fs.access(fullPath);

    const extension = path.extname(fullPath).slice(1).toLowerCase();

    // Check if the file extension is supported
    if (!(extension in supportedExtensions)) {
      return json(
        { error: "Unsupported file type" },
        { status: 415 }
      );
    }

    // Read the file contents
    const content = await fs.readFile(fullPath, "utf-8");

    return json({
      content,
      language: supportedExtensions[extension],
      name: path.basename(fullPath),
      extension
    });
  } catch (error: any) {
    if (error.code === "ENOENT") {
      return json(
        { error: "File not found" },
        { status: 404 }
      );
    }
    return json(
      { error: error.message },
      { status: 500 }
    );
  }
}