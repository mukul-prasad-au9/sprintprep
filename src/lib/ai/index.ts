import { GeminiProvider } from "./gemini";
import { MockAiProvider } from "./mock";
import { OpenAIProvider } from "./openai";
import type { AiProvider } from "./provider";

let cached: AiProvider | null = null;

export function getAiProvider(): AiProvider {
  if (cached) return cached;

  const preferMock =
    process.env.USE_MOCK_AI === "true" ||
    (!process.env.GEMINI_API_KEY && !process.env.OPENAI_API_KEY);

  if (preferMock) {
    cached = new MockAiProvider();
    return cached;
  }

  const preferred = (process.env.AI_PROVIDER ?? "gemini").toLowerCase();
  const geminiKey = process.env.GEMINI_API_KEY?.trim();
  const openaiKey = process.env.OPENAI_API_KEY?.trim();

  if (preferred === "gemini" && geminiKey) {
    cached = new GeminiProvider(geminiKey);
    return cached;
  }

  if (preferred === "openai" && openaiKey) {
    cached = new OpenAIProvider(openaiKey);
    return cached;
  }

  if (geminiKey) {
    cached = new GeminiProvider(geminiKey);
    return cached;
  }

  if (openaiKey) {
    cached = new OpenAIProvider(openaiKey);
    return cached;
  }

  cached = new MockAiProvider();
  return cached;
}

export function resetAiProviderCache(): void {
  cached = null;
}
