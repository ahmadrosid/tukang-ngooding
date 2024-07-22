import { createAnthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';

const anthropic = createAnthropic({
  apiKey: env.ANTHROPIC_API_KEY,
});

export const POST = (async ({ request }) => {
  const data = await request.json();
  const { messages } = data;

  const result = await streamText({
    model: anthropic('claude-3-5-sonnet-20240620'),
    messages,
    onFinish: ({ text }) => {
      // console.log('finish', text);
    },
  });

  return result.toAIStreamResponse();
}) satisfies RequestHandler;