import { createAnthropic } from "@ai-sdk/anthropic";
import { streamText, type CoreMessage } from "ai";
import type { RequestHandler } from "./$types";
import { env } from "$env/dynamic/private";

const anthropic = createAnthropic({
  apiKey: env.ANTHROPIC_API_KEY,
});

import path from "path";
import { promises as fs } from "fs";

// List of supported file extensions and their corresponding languages
const supportedExtensions = {
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

const getSystemMessage = async (filePath: string) => {
  let contents = "";
  const fullPath = path.resolve(process.cwd(), filePath);
  await fs.access(fullPath);
  const extension = path.extname(fullPath).slice(1).toLowerCase();

  if (!(extension in supportedExtensions)) {
    throw new Error("Unsupported file type");
  }

  contents = await fs.readFile(fullPath, "utf-8");
  return `Use the provided code to answer this question. Answer succinctly and provide code snippets ifneeded.
Use this format for code snippets:

===
${filePath}
\`\`\`
${contents}
\`\`\`
===`;
};

export const POST = (async ({ request }) => {
  const data = await request.json();
  console.log({file: data.file});
  const { messages } = data;

  let newMessages: CoreMessage[] = messages;

  if (newMessages[0]?.role === "assistant") {
    newMessages = newMessages.slice(1);
  }

  if (data.file) {
    const systemMessage = await getSystemMessage(data.file);
    newMessages = [
      {
        role: "system",
        content: systemMessage,
      },
      ...messages,
    ];
  }

  console.log(newMessages);
  
  const result = await streamText({
    model: anthropic("claude-3-5-sonnet-20240620"),
    messages: newMessages,
    onFinish: ({ text }) => {
      // console.log('finish', text);
    },
  });

  return result.toAIStreamResponse();
}) satisfies RequestHandler;
