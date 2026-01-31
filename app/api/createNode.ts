import { Edge, Flow, Node } from "./types";
let FLOWID = "DUMMY_FLOW";
const NODE_GAP = 320;

const generateId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const loadFlow = (flowId: string): Flow | null => {
  const raw = localStorage.getItem(FLOWID);
  return raw ? JSON.parse(raw) : null;
};

const saveFlow = (flowId: string, flow: Flow) => {
  localStorage.setItem(FLOWID, JSON.stringify(flow));
};

export const getFlow = (flowId: string): Flow | null => {
  return loadFlow(FLOWID);
};

// POST /flows
export const createFlow = () => {
  const flowId = generateId();
  const flow: Flow = {
    id: FLOWID,
    name: flowId,
    nodes: [],
    edges: [],
  };

  saveFlow(FLOWID, flow);
  return FLOWID;
};

// POST /flows/:id/nodes
export const addNodeToFlow = (
  flowId: string,
  parentNodeId: string | null,
  data: { question: string; answer: string },
): { node: Node; edge: Edge | null } => {
  const flow = loadFlow(flowId);
  if (!flow) throw new Error("Flow not found");

  const currentNodeId = String(Date.now());

  const currentNode: Node = {
    id: String(currentNodeId),
    type: "BaseNode",
    position: { x: 0, y: 0 },
    data,
  };
  flow.nodes.push(currentNode);
  let currentEdge: Edge | null = null;
  if (parentNodeId) {
    currentEdge = {
      id: `${parentNodeId}-${currentNodeId}`,
      source: String(parentNodeId),
      target: String(currentNodeId),
      markerStart: "circle",
      markerEnd: "circle",
      type: "smoothstep",
      style: { stroke: "#7f7f86", strokeWidth: 1 },
    };
    flow.edges.push(currentEdge);
  }

  saveFlow(flowId, flow);

  return { node: currentNode, edge: currentEdge };
};

// PATCH /nodes/:id
// export const updateNodePosition = (
//   nodeId: string,
//   position: { x: number; y: number },
// ) => {
//   const flow = loadFlow();
//   if (!flow) return;

//   const node = flow.nodes.find((n) => n.id === nodeId);
//   if (!node) return;

//   node.position = position;

//   saveFlow(flow);
// };
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
