import {
    addNodeToFlow,
    createFlow,
    updateNodeAnswer,
    updateNodeSummary,
} from "@/app/api/createNode";
import { DEFAULT_MODEL } from "@/app/api/providers";
import { Node } from "@/app/api/types";
import { useAppContext } from "@/app/context/context";
import {
    buildMessages,
    generateSummary,
    getAncestorPath,
    WINDOW_SIZE,
} from "@/utils/chatLogic";
import getLayoutedElements from "@/utils/dagre-layout";
import { useRef, useState } from "react";

export const useChat = () => {
  const { setEdges, setNodes, nodes, edges } = useAppContext();
  const [value, setValue] = useState("");
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL);
  const [flowId, setFlowId] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Runs after a node's response is complete. Checks whether the tail
  // (exchanges after the last summarized ancestor) has grown past WINDOW_SIZE.
  const maybeSummarize = async (
    newNodeId: string,
    fullPath: Node[], // root → new node inclusive, with the completed answer
    currentFlowId: string
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
          : n
      )
    );

    // Persist to localStorage so it survives a refresh
    updateNodeSummary(currentFlowId, newNodeId, newSummary);
  };

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
      updatedEdges as any
    );
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);

    // Build messages with summary + sliding window
    const messages = buildMessages(
      nodes,
      edges,
      parentNodeId,
      currentQuestion
    );

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
                    : n
                )
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
            : n
        )
      );
      updateNodeAnswer(createdFlowId, node.id, fullAnswer);

      // Fire-and-forget: check if we need to summarize now.
      // We build the full path manually here because the `nodes` closure is stale
      // at this point — ancestor positions haven't changed, so getAncestorPath is safe,
      // and we append the new node with its completed answer ourselves.
      // Use the helper from chatLogic.
      const ancestorPath = getAncestorPath(nodes, edges, parentNodeId);
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
            : n
        )
      );
      updateNodeAnswer(createdFlowId, node.id, "");
    }

    inputRef.current?.focus();
  };

  return {
    value,
    setValue,
    selectedModel,
    setSelectedModel,
    inputRef,
    handleSubmit,
    flowId,
  };
};
