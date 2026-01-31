import { Edge, Flow, Node } from "./types";
const NODE_GAP = 320;

const generateId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const loadFlow = (flowId: string): Flow | null => {
  const raw = localStorage.getItem(flowId);
  return raw ? JSON.parse(raw) : null;
};

const saveFlow = (flowId: string, flow: Flow) => {
  localStorage.setItem(flowId, JSON.stringify(flow));
};

export const getFlow = (flowId: string): Flow | null => {
  return loadFlow(flowId);
};

// POST /flows
export const createFlow = () => {
  const flowId = generateId();
  const flow: Flow = {
    id: flowId,
    name: flowId,
    nodes: [],
    edges: [],
  };

  saveFlow(flowId, flow);
  return flowId;
};

// POST /flows/:id/nodes
export const addNodeToFlow = (
  flowId: string,
  data: { question: string; answer: string },
  // parentNodeId: string,
): { node: Node; edge: Edge | null } => {
  const flow = loadFlow(flowId);
  if (!flow) throw new Error("Flow not found");

  const currentNodeId = flow.nodes.length + 1;
  const prevId = currentNodeId - 1;
  const lastNode = flow.nodes[flow.nodes.length - 1];
  const currentNode: Node = {
    id: String(currentNodeId),
    type: "BaseNode",
    position: {
      x: lastNode ? lastNode.position.x + NODE_GAP : 0,
      y: lastNode ? lastNode.position.y : 0,
    },
    data,
  };
  flow.nodes.push(currentNode);
  let currentEdge: Edge | null = null;
  // if its the first node don't append edge
  if (flow.nodes.length > 0) {
    currentEdge = {
      id: `${prevId}-${currentNodeId}`,
      source: String(prevId),
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

  // const nodeId = flow.nodes.length + 1;
  // const prevId = nodeId - 1;
  // const lastNode = flow.nodes[flow.nodes.length - 1];

  // const node: Node = {
  //   id: String(nodeId),
  //   type: "BaseNode",
  //   position: {
  //     x: lastNode ? lastNode.position.x + NODE_GAP : 0,
  //     y: lastNode ? lastNode.position.y : 0,
  //   },
  //   data,
  // };

  // flow.nodes.push(node);

  // let edge: Edge | undefined;

  // if (prevId >= 1) {
  //   edge = {
  //     id: `${prevId}-${nodeId}`,
  //     source: String(prevId),
  //     target: String(nodeId),
  //     markerStart: "circle",
  //     markerEnd: "circle",
  //     type: "smoothstep",
  //     style: { stroke: "#7f7f86", strokeWidth: 1 },
  //   };

  //   flow.edges.push(edge);
  // }

  // saveFlow(flow);

  // return { node, edge };
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
