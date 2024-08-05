import { json } from "@sveltejs/kit";
import fs from "fs/promises";
import path from "path";

import { resolveAndValidateFilePath } from "$lib/+serverUtils";

export const POST = async ({ request }) => {
  const { newRoot } = await request.json();
  try {
    await resolveAndValidateFilePath(newRoot);
    process.env.CURRENT_DIRECTORY = newRoot;

    return json({ success: true });
  } catch (error) {
    return json(
      { success: false, error: "Directory does not exist" },
      { status: 400 }
    );
  }
};
