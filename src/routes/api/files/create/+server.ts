import { json } from '@sveltejs/kit';
import path from 'path';
import { promises as fs } from 'fs';
import { writeFile, getCurrentDirectory } from "$lib/+serverUtils";

const currentDirectory = getCurrentDirectory();

async function resolveFilePath(fileName: string): Promise<string> {
    const fullPath = path.resolve(currentDirectory, fileName);
    
    if (!fullPath.startsWith(currentDirectory)) {
        throw new Error("Access denied. Cannot create file outside the current directory.");
    }
    
    return fullPath;
}

export const POST = async ({ request }: any) => {
    const { fileName, content } = await request.json();

    if (!fileName) {
        return json({ error: "File name is required" }, { status: 400 });
    }

    try {
        const fullPath = await resolveFilePath(fileName);
        const dirPath = path.dirname(fullPath);
        await fs.mkdir(dirPath, { recursive: true });
        await writeFile(fullPath, content || '');
        return json({
            message: "File created successfully",
            name: path.basename(fullPath),
            path: path.relative(currentDirectory, fullPath)
        }, { status: 201 });
    } catch (error) {
        return json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
    }
};
