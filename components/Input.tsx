"use client";

import {
  addNodeToFlow,
  createFlow,
  updateNodeAnswer,
} from "@/app/api/createNode";
import { DEFAULT_MODEL, PROVIDERS } from "@/app/api/providers";
import { useAppContext } from "@/app/context/context";
import getLayoutedElements from "@/utils/dagre-layout";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import ArrowUpIcon from "./icons/ArrowUp";

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

  // Walks from a node up to the root via edges, returns ancestors in chronological order (root first)
  const getConversationHistory = (startNodeId: string | null) => {
    const path: typeof nodes = [];
    let currentId = startNodeId;

    while (currentId) {
      const node = nodes.find((n) => n.id === currentId);
      if (node) path.unshift(node); // prepend so root ends up first
      const parentEdge = edges.find((e) => e.target === currentId);
      currentId = parentEdge?.source ?? null;
    }

    // Convert the node path into an OpenRouter-compatible messages array
    return path.flatMap((node) => [
      { role: "user" as const, content: node.data.question },
      { role: "assistant" as const, content: node.data.answer },
    ]);
  };

  const handleSubmit = async () => {
    if (!value.trim()) return;

    const currentQuestion = value;
    setValue("");
    if (inputRef.current) {
      inputRef.current.style.height = "1lh";
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

    // Build full conversation: ancestors up to parent + current question
    const history = getConversationHistory(parentNodeId);
    const messages = [
      ...history,
      { role: "user" as const, content: currentQuestion },
    ];

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
        buffer = lines.pop() || ""; // keep any incomplete line in the buffer

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") break;

          try {
            const json = JSON.parse(data);
            const delta = json.choices?.[0]?.delta?.content || "";
            if (delta) {
              fullAnswer += delta;
              // Update only this node's answer — no re-layout needed
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

      // Streaming done — clear loading flag and persist to localStorage
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

  const updateHeight = () => {
    const ta = inputRef.current;
    if (!ta) return;
    ta.style.height = "1lh";
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
        style={{ height: "1lh" }}
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
