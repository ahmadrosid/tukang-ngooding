import path from "path";
import { promises as fs } from "fs";

const supportedExtensions: Record<string, string> = {
  txt: "Plain Text",
  js: "JavaScript",
  ts: "TypeScript",
  html: "HTML",
  css: "CSS",
  json: "JSON",
  md: "Markdown",
  py: "Python",
  java: "Java",
  c: "C",
  cpp: "C++",
  go: "Go",
  rs: "Rust",
  sql: "SQL",
  xml: "XML",
  yaml: "YAML",
  sh: "Shell",
  svelte: "Svelte",
};

export async function getSystemMessage(filePath: string): Promise<string> {
  const fullPath = path.resolve(process.cwd(), filePath);
  await fs.access(fullPath);
  const extension = path.extname(fullPath).slice(1).toLowerCase();

  if (!(extension in supportedExtensions)) {
    throw new Error("Unsupported file type");
  }

  const contents = await fs.readFile(fullPath, "utf-8");
  return `Use the provided code to answer this question. 
Answer succinctly and provide code snippets if needed.
Use this format for code snippets:

===
${filePath}
\`\`\`
${contents}
\`\`\`
===

When user asking for code, give the diff of the code changes you made.
`;
}

export async function updateFile(filePath: string, content: string): Promise<void> {
  try {
    // Resolve the full path
    const fullPath = path.resolve(process.cwd(), filePath);

    // Validate the file path
    if (!isValidFilePath(fullPath)) {
      throw new Error('Invalid file path');
    }

    // Check if file exists
    await fs.access(fullPath);

    // Read the existing content
    const existingContent = await fs.readFile(fullPath, 'utf8');

    // Compare and update only if there are changes
    if (existingContent !== content) {
      // Create a backup of the original file
      const backupPath = `${fullPath}.bak`;
      await fs.writeFile(backupPath, existingContent, 'utf8');

      // Write the new content
      await fs.writeFile(fullPath, content, 'utf8');

      console.log(`File ${filePath} updated successfully. Backup created at ${backupPath}`);
    } else {
      console.log(`File ${filePath} content unchanged. No update needed.`);
    }
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      console.error(`File ${filePath} does not exist.`);
    } else {
      console.error(`Error updating file ${filePath}:`, error);
    }
    throw error;
  }
}

function isValidFilePath(fullPath: string): boolean {
  // Define the allowed directory (e.g., your project root)
  const allowedDirectory = process.cwd();

  // Check if the file path is within the allowed directory
  if (!fullPath.startsWith(allowedDirectory)) {
    return false;
  }

  // Add more checks as needed, e.g., file extensions, specific subdirectories, etc.
  const allowedExtensions = ['.ts', '.js', '.svelte']; // Add more as needed
  if (!allowedExtensions.includes(path.extname(fullPath))) {
    return false;
  }

  return true;
}
