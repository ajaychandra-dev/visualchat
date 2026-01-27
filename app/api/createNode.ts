import { Edge, Flow, Node } from "./types";
const NODE_GAP = 320; // reduce spacing

export const BASE_FLOW: Flow = {
  id: "",
  name: "My Flow",
  nodes: [],
  edges: [],
};

const FLOW_KEY = "visual-chat-flow";

const loadFlow = (): Flow | null => {
  const raw = localStorage.getItem(FLOW_KEY);
  return raw ? JSON.parse(raw) : null;
};

const saveFlow = (flow: Flow) => {
  localStorage.setItem(FLOW_KEY, JSON.stringify(flow));
};

const generateId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export const getFlow = (): Flow | null => {
  return loadFlow();
};

export const createFlow = (): Flow => {
  const flow: Flow = {
    ...BASE_FLOW,
    id: generateId(),
    nodes: [],
    edges: [],
  };

  saveFlow(flow);
  return flow;
};

// POST /flows/:id/nodes
export const addNodeToFlow = (
  question: string,
  answer: string,
): { node: Node; edge?: Edge } => {
  const flow = loadFlow();
  if (!flow) throw new Error("Flow not found");

  const nodeId = flow.nodes.length + 1;
  const prevId = nodeId - 1;

  const lastNode = flow.nodes[flow.nodes.length - 1];

  const node: Node = {
    id: String(nodeId),
    type: "BaseNode",
    position: {
      x: lastNode ? lastNode.position.x + NODE_GAP : 0,
      y: lastNode ? lastNode.position.y : 0,
    },
    data: { question, answer },
  };

  flow.nodes.push(node);

  let edge: Edge | undefined;

  if (prevId >= 1) {
    edge = {
      id: `${prevId}-${nodeId}`,
      source: String(prevId),
      target: String(nodeId),
      markerStart: "circle",
      markerEnd: "circle",
      type: "smoothstep",
      style: { stroke: "#7f7f86", strokeWidth: 1 },
    };

    flow.edges.push(edge);
  }

  saveFlow(flow);

  return { node, edge };
};

// PATCH /nodes/:id
export const updateNodePosition = (
  nodeId: string,
  position: { x: number; y: number },
) => {
  const flow = loadFlow();
  if (!flow) return;

  const node = flow.nodes.find((n) => n.id === nodeId);
  if (!node) return;

  node.position = position;

  saveFlow(flow);
};
export const STEPS = [
  {
    question: "What can you do?",
    answer: "I help with learning, coding, and problem-solving.",
  },
  {
    question: "I want to learn programming",
    answer: "Great! We’ll start with the basics.",
  },
  {
    question: "Which language should I pick?",
    answer: "Python or JavaScript are great choices.",
  },
  {
    question: "Let’s pick Python",
    answer: "Nice choice. Python is beginner-friendly.",
  },
  {
    question: "What should I learn first?",
    answer: "Variables, loops, and functions.",
  },
  {
    question: "How do I practice?",
    answer: "Build small projects and practice daily.",
  },
  {
    question: "Any resources?",
    answer: "freeCodeCamp, docs, and hands-on practice.",
  },
];
