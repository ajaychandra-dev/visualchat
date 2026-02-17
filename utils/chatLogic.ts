import { Node } from "@/app/api/types";
import { Edge } from "@xyflow/react";

// How many messages (user + assistant pairs) to keep verbatim after the summary.
// 6 = the last 3 full exchanges are always sent raw.
export const WINDOW_SIZE = 6;

// A small, fast model dedicated to summarization — keeps it cheap and quick
// regardless of which model the user picked for the actual conversation.
export const SUMMARY_MODEL = "qwen/qwen3-4b:free";

// Walks from targetNodeId up to the root via edges.
// Returns the full ancestor path in chronological order (root first).
export const getAncestorPath = (
  nodes: Node[],
  edges: Edge[],
  targetNodeId: string | null
): Node[] => {
  const path: Node[] = [];
  let currentId = targetNodeId;
  while (currentId) {
    const node = nodes.find((n) => n.id === currentId);
    if (node) path.unshift(node);
    const parentEdge = edges.find((e) => e.target === currentId);
    currentId = parentEdge?.source ?? null;
  }
  return path;
};

// Builds the messages array to send to the API.
// If a cached summary exists on an ancestor, it becomes a system message
// and only the exchanges AFTER that ancestor are included verbatim.
export const buildMessages = (
  nodes: Node[],
  edges: Edge[],
  parentNodeId: string | null,
  currentQuestion: string
) => {
  const path = getAncestorPath(nodes, edges, parentNodeId); // root → parent

  // Find the nearest ancestor that has a cached summary (search from parent backward)
  let summaryIndex = -1;
  let summary = "";
  for (let i = path.length - 1; i >= 0; i--) {
    if (path[i].data.summary) {
      summaryIndex = i;
      summary = path[i].data.summary as string;
      break;
    }
  }

  // Tail = everything after the summarized node (or the full path if no summary)
  const tail = summaryIndex >= 0 ? path.slice(summaryIndex + 1) : path;

  const messages: {
    role: "system" | "user" | "assistant";
    content: string;
  }[] = [];

  if (summary) {
    messages.push({
      role: "system",
      content: `You are continuing a conversation. Here is a summary of everything discussed so far:\n\n${summary}`,
    });
  }

  // Add the tail exchanges verbatim
  tail.forEach((node) => {
    messages.push({ role: "user", content: node.data.question as string });
    messages.push({ role: "assistant", content: node.data.answer as string });
  });

  // Append the new question
  messages.push({ role: "user", content: currentQuestion });

  return messages;
};

// Calls the API in non-streaming mode to generate a summary.
// If it fails for any reason, returns the existing summary so nothing breaks.
export const generateSummary = async (
  existingSummary: string,
  nodesToSummarize: Node[]
): Promise<string> => {
  let prompt =
    "You are a conversation summarizer. Produce a concise but comprehensive summary that preserves all key topics, decisions, code snippets, and important details needed to continue the conversation.\n\n";

  if (existingSummary) {
    prompt += `Here is the summary of the conversation so far:\n\n${existingSummary}\n\nNew exchanges to incorporate:\n\n`;
  } else {
    prompt += "Summarize the following conversation:\n\n";
  }

  nodesToSummarize.forEach((node) => {
    prompt += `User: ${node.data.question}\n\nAssistant: ${node.data.answer}\n\n`;
  });

  prompt +=
    "Produce only the updated summary. Do not include any preamble or meta-commentary.";

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", content: prompt }],
        model: SUMMARY_MODEL,
        stream: false,
      }),
    });

    if (!res.ok) return existingSummary;

    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? existingSummary;
  } catch {
    return existingSummary; // fail silently — conversation still works, just unsummarized
  }
};
