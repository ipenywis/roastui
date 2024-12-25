import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';

export const openRouterModel = createOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
});

export const anthropicModel = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

//OpenRouter model
export const roastModel = openRouterModel(
  'anthropic/claude-3.5-sonnet-20240620:beta',
);
