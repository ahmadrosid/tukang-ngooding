import { json } from "@sveltejs/kit";
import path from "path";
import { promises as fs } from "fs";
import { resolveAndValidateFilePath } from "$lib/+serverUtils.js";

export async function PUT({ request }) {
  const body = await request.json();
  const { filePath, content } = body;

  if (!filePath || content === undefined) {
    return json(
      { error: "File path and content are required" },
      { status: 400 }
    );
  }

  try {
    const encodedFilePath = decodeURIComponent(filePath);
    const fullPath = await resolveAndValidateFilePath(encodedFilePath);
    await fs.writeFile(fullPath, content, "utf-8");
    return json({
      message: "File updated successfully",
      name: path.basename(fullPath),
    });
  } catch (error: any) {
    if (error.code === "ENOENT") {
      return json({ error: "File not found" }, { status: 404 });
    }
    return json({ error: error.message }, { status: 500 });
  }
}
