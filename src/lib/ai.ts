import { createOpenAI } from '@ai-sdk/openai';

export const openRouterModel = createOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
});

export const roastModel = openRouterModel('anthropic/claude-3.5-sonnet');
