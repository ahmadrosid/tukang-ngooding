import path from "path";
import { promises as fs } from "fs";
import { env } from "$env/dynamic/private";

export const supportedExtensions: Record<string, string> = {
  txt: "Plain Text", js: "JavaScript", ts: "TypeScript", html: "HTML",
  css: "CSS", json: "JSON", md: "Markdown", py: "Python",
  java: "Java", c: "C", cpp: "C++", go: "Go", rs: "Rust",
  sql: "SQL", xml: "XML", yaml: "YAML", sh: "Shell",
  svelte: "Svelte", php: "PHP",
};

const allowedExtensions = Object.keys(supportedExtensions);

const currentDirectory: string = env.CURRENT_DIRECTORY || "";

export async function resolveAndValidateFilePath(filePath: string): Promise<string> {
  const fullPath = path.resolve(currentDirectory, filePath);
  await fs.access(fullPath);
  return fullPath;
}

async function validateAndResolvePath(filePath: string): Promise<string> {
  const fullPath = path.resolve(currentDirectory, filePath);
  
  if (!fullPath.startsWith(currentDirectory) || 
      !allowedExtensions.includes(path.extname(fullPath))) {
    throw new Error('Invalid file path');
  }

  await fs.access(fullPath);
  return fullPath;
}

async function readFile(filePath: string): Promise<string> {
  return fs.readFile(filePath, "utf-8");
}

async function writeFile(filePath: string, content: string): Promise<void> {
  await fs.writeFile(filePath, content, "utf-8");
}

export async function getSystemMessage(filePath: string): Promise<string> {
  const fullPath = await resolveAndValidateFilePath(filePath);
  const extension = path.extname(fullPath).slice(1).toLowerCase();

  if (!(extension in supportedExtensions)) {
    throw new Error("Unsupported file type");
  }

  const contents = await readFile(fullPath);
  return `Use the provided code to answer this question. 
Answer succinctly and provide code snippets if needed.
Use this format for code snippets:

===
${filePath}
\`\`\`
${contents}
\`\`\`
===

When user asking for code, give them the full code.`;
}

export async function updateFile(filePath: string, content: string): Promise<void> {
  try {
    const fullPath = await validateAndResolvePath(filePath);
    const existingContent = await readFile(filePath);

    if (existingContent !== content) {
      const backupPath = `${fullPath}.bak`;
      await writeFile(backupPath, existingContent);
      await writeFile(filePath, content);
      console.log(`File ${filePath} updated successfully. Backup created at ${backupPath}`);
    } else {
      console.log(`File ${filePath} content unchanged. No update needed.`);
    }
  } catch (error: any) {
    console.error(`Error updating file ${filePath}:`, error);
    throw error;
  }
}
