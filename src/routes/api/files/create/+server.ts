import { json } from '@sveltejs/kit';
import path from 'path';
import { promises as fs } from 'fs';
import { env } from '$env/dynamic/private';
import { resolveAndValidateFilePath } from "$lib/+serverUtils";

const currentDirectory = process.env.CURRENT_DIRECTORY || env.CURRENT_DIRECTORY || '';

export const POST = async ({ request }: any) => {
    const { fileName, content } = await request.json();

    if (!fileName) {
        return json({ error: "File name is required" }, { status: 400 });
    }

    try {
        const fullPath = await resolveAndValidateFilePath(fileName);

        const dirPath = path.dirname(fullPath);

        // Create directory if it doesn't exist
        await fs.mkdir(dirPath, { recursive: true });

        // Check if file already exists
        try {
            await fs.access(fullPath);
            return json({ error: "File already exists" }, { status: 409 });
        } catch {
            // File doesn't exist, we can proceed
        }

        // Create the file
        await fs.writeFile(fullPath, content || '', 'utf-8');

        return json({
            message: "File created successfully",
            name: path.basename(fullPath),
            path: path.relative(currentDirectory, fullPath)
        }, { status: 201 });
    } catch (error) {
        return json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
    }
};