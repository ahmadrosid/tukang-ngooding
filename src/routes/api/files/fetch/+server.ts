import { json } from "@sveltejs/kit";
import path from "path";
import { promises as fs } from "fs";

// List of supported file extensions and their corresponding languages
const supportedExtensions = {
  'txt': 'Plain Text',
  'js': 'JavaScript',
  'ts': 'TypeScript',
  'html': 'HTML',
  'css': 'CSS',
  'json': 'JSON',
  'md': 'Markdown',
  'py': 'Python',
  'java': 'Java',
  'c': 'C',
  'cpp': 'C++',
  'go': 'Go',
  'rs': 'Rust',
  'sql': 'SQL',
  'xml': 'XML',
  'yaml': 'YAML',
  'sh': 'Shell',
  'svelte': 'Svelte',
};

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
    const fullPath = path.resolve(process.cwd(), filePath);
    
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