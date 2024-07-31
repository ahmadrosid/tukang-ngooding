import { json } from '@sveltejs/kit';
import path from 'path';
import { promises as fs } from 'fs';
import { env } from '$env/dynamic/private';

const currentDirectory = env.CURRENT_DIRECTORY || '';

export const POST = async ({ request }: any) => {
    const { fileName, content } = await request.json();

    if (!fileName) {
        return json({ error: "File name is required" }, { status: 400 });
    }

    try {
        const fullPath = path.resolve(currentDirectory, fileName);
        
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
            name: path.basename(fullPath)
        }, { status: 201 });
    } catch (error) {
        return json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
    }
};