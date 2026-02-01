export type Provider = {
  id: string;
  label: string;
  group: string;
};

// export const PROVIDERS: Provider[] = [
//   { id: "openai/gpt-4o-mini", label: "GPT-4o Mini", group: "OpenAI" },
//   { id: "openai/gpt-4o", label: "GPT-4o", group: "OpenAI" },
//   { id: "anthropic/claude-sonnet-4-5", label: "Claude Sonnet 4.5", group: "Anthropic" },
//   { id: "anthropic/claude-haiku-4-5", label: "Claude Haiku 4.5", group: "Anthropic" },
//   { id: "google/gemini-2.0-flash", label: "Gemini 2.0 Flash", group: "Google" },
//   { id: "google/gemini-2.5-pro", label: "Gemini 2.5 Pro", group: "Google" },
// ];

// export const DEFAULT_MODEL = "openai/gpt-4o-mini";

// Free models for testing — all use the :free suffix on OpenRouter.
// Free models for testing — all use the :free suffix on OpenRouter.
// Note: free model prompts/outputs are logged by the provider.
// Swap these out for paid models when ready.
// Source: https://openrouter.ai/collections/free-models
export const PROVIDERS: Provider[] = [
  {
    id: "google/gemma-3-27b-it:free",
    label: "Gemma 3 27B",
    group: "Google",
  },
  {
    id: "arcee-ai/trinity-large-preview:free",
    label: "Trinity Large",
    group: "Acree AI",
  },
];

export const DEFAULT_MODEL = "google/gemma-3-27b-it:free";

//"tngtech/deepseek-r1t2-chimera:free";
// openai/gpt-oss-120b:free
// meta-llama/llama-3.3-70b-instruct:free
// qwen/qwen3-coder:free
// qwen/qwen3-4b:free
// deepseek/deepseek-r1-0528:free
