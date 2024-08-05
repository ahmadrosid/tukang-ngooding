import { json } from '@sveltejs/kit';
import path from 'path';
import { promises as fs } from 'fs';
import { resolveAndValidateFilePath, writeFile, getCurrentDirectory } from "$lib/+serverUtils";

const currentDirectory = getCurrentDirectory();

export const POST = async ({ request }: any) => {
    const { fileName, content } = await request.json();

    if (!fileName) {
        return json({ error: "File name is required" }, { status: 400 });
    }

    try {
        const fullPath = await resolveAndValidateFilePath(fileName);
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