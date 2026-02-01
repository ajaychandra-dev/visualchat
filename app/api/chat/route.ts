import { NextResponse } from "next/server";
import { PROVIDERS } from "../providers";

export async function POST(req: Request) {
  const { messages, model, stream = true } = await req.json();

  // Validate that the requested model is in our allowed list
  const isValidModel = PROVIDERS.some((p) => p.id === model);
  if (!isValidModel) {
    return NextResponse.json({ error: "Invalid model" }, { status: 400 });
  }

  if (!process.env.OPENROUTER_API_KEY) {
    return NextResponse.json(
      { error: "OPENROUTER_API_KEY is not set in .env.local" },
      { status: 500 },
    );
  }

  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages,
        stream,
      }),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    return NextResponse.json(
      { error: errorText || "OpenRouter request failed" },
      { status: response.status },
    );
  }

  // Non-streaming: return the full JSON response (used for summarization)
  if (!stream) {
    const data = await response.json();
    return NextResponse.json(data);
  }

  // Streaming: pipe the SSE stream straight back to the client
  return new Response(response.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
