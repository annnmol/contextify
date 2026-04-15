import OpenAI from "openai";
import type { ResponseStreamEvent } from "openai/resources/responses/responses.js";

const client = new OpenAI();

const MODEL = "gpt-5.4-nano";
const TEMPERATURE = 0.3;

type GenerateOptions = {
  message: string;
  conversationId?: string;
  systemPrompt?: string;
  maxTokens?: number;
};

export async function generateMessage(
  opts: GenerateOptions
): Promise<{ text: string; id: string }> {
  const { message, conversationId, systemPrompt, maxTokens = 100 } = opts;
  const response = await client.responses.create({
    model: MODEL,
    input: message,
    temperature: TEMPERATURE,
    max_output_tokens: maxTokens,
    previous_response_id: conversationId || undefined,
    ...(systemPrompt ? { instructions: systemPrompt } : {}),
    stream: false,
  });
  return { text: response.output_text, id: response.id };
}

export async function generateStream(
  opts: GenerateOptions
): Promise<AsyncIterable<ResponseStreamEvent>> {
  const { message, conversationId, systemPrompt, maxTokens = 100 } = opts;
  return client.responses.create({
    model: MODEL,
    input: message,
    temperature: TEMPERATURE,
    max_output_tokens: maxTokens,
    previous_response_id: conversationId || undefined,
    ...(systemPrompt ? { instructions: systemPrompt } : {}),
    stream: true,
  });
}
