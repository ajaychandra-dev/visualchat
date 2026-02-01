export type Provider = {
  id: string;
  label: string;
  group: string;
};

export const PROVIDERS: Provider[] = [
  {
    id: "google/gemma-3-27b-it:free",
    label: "Gemma 3 27B",
    group: "Google",
  },
  {
    id: "tngtech/deepseek-r1t2-chimera:free",
    label: "DeepSeek R1T2 Chimera",
    group: "DeepSeek",
  },
  {
    id: "arcee-ai/trinity-large-preview:free",
    label: "Trinity Large Preview",
    group: "Arcee AI",
  },
];

export const DEFAULT_MODEL = "arcee-ai/trinity-large-preview:free";
