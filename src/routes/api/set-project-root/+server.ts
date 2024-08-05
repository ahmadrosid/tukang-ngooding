import { json } from "@sveltejs/kit";

import { resolveAndValidateFilePath } from "$lib/+serverUtils";

function setCurrentDirectory(directory: string) {
  process.env.CURRENT_DIRECTORY = directory;
}

export const POST = async ({ request }) => {
  const { newRoot } = await request.json();
  try {
    await resolveAndValidateFilePath(newRoot);
    setCurrentDirectory(newRoot);

    return json({ success: true });
  } catch (error) {
    return json(
      { success: false, error: "Directory does not exist" },
      { status: 400 }
    );
  }
};