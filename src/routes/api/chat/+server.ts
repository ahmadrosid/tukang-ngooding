import { createAnthropic } from "@ai-sdk/anthropic";
import { streamText, type CoreMessage } from "ai";
import type { RequestHandler } from "./$types";
import { env } from "$env/dynamic/private";
import { getSystemMessage } from "$lib/+serverUtils";

const anthropic = createAnthropic({
  apiKey: env.ANTHROPIC_API_KEY,
});

function extractCodeSnippets(text: string): string[] {
  // Implement your logic to extract code snippets from the text
  // This is just a placeholder example
  const regex = /```[\s\S]*?```/g;
  return text.match(regex) || [];
}

export const POST = (async ({ request }) => {
  const data = await request.json();
  const { messages } = data;

  let newMessages: CoreMessage[] = messages;

  if (newMessages[0]?.role === "assistant") {
    newMessages = newMessages.slice(1);
  }

  if (data.files) {
    const systemMessage = await getSystemMessage(data.files);
    const result = await streamText({
      model: anthropic("claude-3-5-sonnet-20240620"),
      system: systemMessage,
      messages: newMessages,
      onFinish: async ({ text }) => {
        const codeSnippets = extractCodeSnippets(text);
        console.log("Extracted code snippets:", codeSnippets);

        if (codeSnippets.length > 0) {
          // Assuming the first code snippet is the one to update the file with
          const codeToUpdate = codeSnippets[0]
            .replace(/```[\s\S]*?\n/, "")
            .replace(/\n```$/, "");
          // try {
          //   await updateFile(data.file, codeToUpdate);
          //   console.log("File updated successfully");
          // } catch (error) {
          //   console.error("Error updating file:", error);
          // }
        }
      },
    });

    return result.toAIStreamResponse();
  }

  if (data.systemPrompt) {
    console.log("Using system prompt:", data.systemPrompt);
    const result = await streamText({
      model: anthropic("claude-3-5-sonnet-20240620"),
      messages: newMessages,
      system: data.systemPrompt,
    });
    return result.toAIStreamResponse();
  }

  const result = await streamText({
    model: anthropic("claude-3-5-sonnet-20240620"),
    messages: newMessages,
  });

  return result.toAIStreamResponse();
}) satisfies RequestHandler;
