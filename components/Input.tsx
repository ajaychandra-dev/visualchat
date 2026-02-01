"use client";

import {
  addNodeToFlow,
  createFlow,
  updateNodeAnswer,
  updateNodeSummary,
} from "@/app/api/createNode";
import { DEFAULT_MODEL, PROVIDERS } from "@/app/api/providers";
import { useAppContext } from "@/app/context/context";
import getLayoutedElements from "@/utils/dagre-layout";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import ArrowUpIcon from "./icons/ArrowUp";

// How many messages (user + assistant pairs) to keep verbatim after the summary.
// 6 = the last 3 full exchanges are always sent raw.
const WINDOW_SIZE = 6;

// A small, fast model dedicated to summarization — keeps it cheap and quick
// regardless of which model the user picked for the actual conversation.
const SUMMARY_MODEL = "qwen/qwen3-4b:free";

export default function Input() {
  const [value, setValue] = useState("");
  const [focus, setFocus] = useState(true);
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL);
  const [showModels, setShowModels] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { setEdges, setNodes, nodes, edges } = useAppContext();
  const [flowId, setFlowId] = useState("");

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowModels(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // ---------------------------------------------------------------------------
  // History & summarization helpers
  // ---------------------------------------------------------------------------

  // Walks from targetNodeId up to the root via edges.
  // Returns the full ancestor path in chronological order (root first).
  const getAncestorPath = (targetNodeId: string | null): typeof nodes => {
    const path: typeof nodes = [];
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
  const buildMessages = (
    parentNodeId: string | null,
    currentQuestion: string,
  ) => {
    const path = getAncestorPath(parentNodeId); // root → parent

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
      messages.push({ role: "user", content: node.data.question });
      messages.push({ role: "assistant", content: node.data.answer });
    });

    // Append the new question
    messages.push({ role: "user", content: currentQuestion });

    return messages;
  };

  // Calls the API in non-streaming mode to generate a summary.
  // If it fails for any reason, returns the existing summary so nothing breaks.
  const generateSummary = async (
    existingSummary: string,
    nodesToSummarize: typeof nodes,
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

  // Runs after a node's response is complete. Checks whether the tail
  // (exchanges after the last summarized ancestor) has grown past WINDOW_SIZE.
  // If so, generates a new summary and stores it on this node — so all
  // future children (including branches) inherit it automatically.
  // Runs fire-and-forget so the user isn't blocked waiting for it.
  const maybeSummarize = async (
    newNodeId: string,
    fullPath: typeof nodes, // root → new node inclusive, with the completed answer
    currentFlowId: string,
  ) => {
    // Find nearest ancestor with a cached summary
    let summaryIndex = -1;
    let existingSummary = "";
    for (let i = fullPath.length - 1; i >= 0; i--) {
      if (fullPath[i].data.summary) {
        summaryIndex = i;
        existingSummary = fullPath[i].data.summary as string;
        break;
      }
    }

    // Tail = nodes after the summarized ancestor (or entire path)
    const tail =
      summaryIndex >= 0 ? fullPath.slice(summaryIndex + 1) : fullPath;
    const tailMessageCount = tail.length * 2; // each node = 1 user msg + 1 assistant msg

    // Only trigger summarization once the tail exceeds the window
    if (tailMessageCount <= WINDOW_SIZE) return;

    const newSummary = await generateSummary(existingSummary, tail);

    // Store on this node in React state
    setNodes((prev) =>
      prev.map((n) =>
        n.id === newNodeId
          ? { ...n, data: { ...n.data, summary: newSummary } }
          : n,
      ),
    );

    // Persist to localStorage so it survives a refresh
    updateNodeSummary(currentFlowId, newNodeId, newSummary);
  };

  // ---------------------------------------------------------------------------
  // Submit handler
  // ---------------------------------------------------------------------------

  const handleSubmit = async () => {
    if (!value.trim()) return;

    const currentQuestion = value;
    setValue("");
    if (inputRef.current) {
      inputRef.current.style.height = "1.25lh";
    }

    // Create flow if this is the first message
    let createdFlowId = flowId;
    if (nodes.length === 0) {
      createdFlowId = createFlow();
      setFlowId(createdFlowId);
    }

    const parentNodeId =
      nodes.find((node) => node.selected)?.id ??
      nodes[nodes.length - 1]?.id ??
      null;

    // Add node immediately with loading state
    const { node, edge } = addNodeToFlow(createdFlowId, parentNodeId, {
      question: currentQuestion,
      answer: "",
      isLoading: true,
    });

    const updatedNodes = [
      ...nodes.map((n) => ({ ...n, selected: false })),
      { ...node, selected: true },
    ];
    const updatedEdges = edge ? [...edges, edge] : edges;

    // Layout and render the loading node
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      updatedNodes,
      updatedEdges as any,
    );
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);

    // Build messages with summary + sliding window
    const messages = buildMessages(parentNodeId, currentQuestion);

    // Stream response from OpenRouter via our API route
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages, model: selectedModel }),
      });

      if (!res.ok || !res.body) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "API request failed");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullAnswer = "";
      let buffer = "";

      while (true) {
        const { value: chunk, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(chunk, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") break;

          try {
            const json = JSON.parse(data);
            const delta = json.choices?.[0]?.delta?.content || "";
            if (delta) {
              fullAnswer += delta;
              setNodes((prev) =>
                prev.map((n) =>
                  n.id === node.id
                    ? { ...n, data: { ...n.data, answer: fullAnswer } }
                    : n,
                ),
              );
            }
          } catch {
            // Malformed SSE chunk — skip
          }
        }
      }

      // Streaming done — clear loading flag and persist answer
      setNodes((prev) =>
        prev.map((n) =>
          n.id === node.id
            ? {
                ...n,
                data: { ...n.data, answer: fullAnswer, isLoading: false },
              }
            : n,
        ),
      );
      updateNodeAnswer(createdFlowId, node.id, fullAnswer);

      // Fire-and-forget: check if we need to summarize now.
      // We build the full path manually here because the `nodes` closure is stale
      // at this point — ancestor positions haven't changed, so getAncestorPath is safe,
      // and we append the new node with its completed answer ourselves.
      const ancestorPath = getAncestorPath(parentNodeId);
      const completedNode = {
        ...node,
        data: { ...node.data, answer: fullAnswer, isLoading: false },
      };
      maybeSummarize(node.id, [...ancestorPath, completedNode], createdFlowId);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Something went wrong";
      setNodes((prev) =>
        prev.map((n) =>
          n.id === node.id
            ? {
                ...n,
                data: {
                  ...n.data,
                  answer: "",
                  error: errorMessage,
                  isLoading: false,
                },
              }
            : n,
        ),
      );
      updateNodeAnswer(createdFlowId, node.id, "");
    }

    inputRef.current?.focus();
  };

  // ---------------------------------------------------------------------------
  // UI helpers
  // ---------------------------------------------------------------------------

  const updateHeight = () => {
    const ta = inputRef.current;
    if (!ta) return;
    ta.style.height = "1.25lh";
    if (ta.scrollHeight > ta.clientHeight) {
      ta.style.height = "auto";
      ta.style.height = `${ta.scrollHeight}px`;
    }
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) handleSubmit();
    }
  };

  // Group providers by their group label
  const grouped = PROVIDERS.reduce<Record<string, typeof PROVIDERS>>(
    (acc, p) => {
      (acc[p.group] ??= []).push(p);
      return acc;
    },
    {},
  );

  const currentLabel =
    PROVIDERS.find((p) => p.id === selectedModel)?.label ?? selectedModel;

  return (
    <form
      className={clsx(
        "w-[600px] max-h-[238px] self-center mb-12 bg-nodebg rounded-lg p-3 flex flex-col gap-3 border flex-shrink-0 pointer-events-auto",
        focus ? "border-inputfocus" : "border-transparent",
      )}
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <textarea
        autoFocus
        onKeyDown={handleKeyDown}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        name="prompt-input"
        className="placeholder-placeholder caret-input text-input w-full focus:outline-none resize-none pr-4 overflow-auto scrollbar-thin scrollbar-thumb-node-header scrollbar-track-transparent"
        style={{ height: "1.25lh", minHeight: "1.25lh" }}
        placeholder="Type your message"
        onChange={(e) => setValue(e.target.value)}
        value={value}
        ref={inputRef}
        onInput={updateHeight}
      />

      {/* Bottom row: model selector + submit */}
      <div className="flex items-center justify-between">
        {/* Model selector */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setShowModels(!showModels)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-node-header hover:bg-[#4a4a4a] transition-colors"
          >
            <span className="text-xs text-placeholder">{currentLabel}</span>
            <svg
              width={10}
              height={10}
              viewBox="0 0 10 10"
              fill="none"
              className={`transition-transform ${showModels ? "rotate-180" : ""}`}
            >
              <path
                d="M2.5 3.75L5 6.25L7.5 3.75"
                stroke="#7f7f86"
                strokeWidth={1.25}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {showModels && (
            <div className="absolute bottom-full left-0 mb-2 w-52 bg-[#2a2a2e] border border-[#454545] rounded-lg shadow-lg overflow-hidden">
              {Object.entries(grouped).map(([group, models], i) => (
                <div key={group}>
                  {i > 0 && <div className="border-t border-[#3a3a3e]" />}
                  <div className="px-3 pt-2 pb-1">
                    <span className="text-[10px] text-placeholder uppercase tracking-wider">
                      {group}
                    </span>
                  </div>
                  {models.map((model) => (
                    <button
                      key={model.id}
                      type="button"
                      onClick={() => {
                        setSelectedModel(model.id);
                        setShowModels(false);
                      }}
                      className={clsx(
                        "w-full text-left px-3 py-1.5 text-xs transition-colors",
                        model.id === selectedModel
                          ? "text-input bg-[#3a3a3e]"
                          : "text-placeholder hover:text-input hover:bg-[#333338]",
                      )}
                    >
                      {model.label}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className={clsx(
            "p-1 rounded-sm self-end cursor-pointer",
            value ? "bg-input" : "bg-placeholder",
          )}
        >
          <ArrowUpIcon />
        </button>
      </div>
    </form>
  );
}
