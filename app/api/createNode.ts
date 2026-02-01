import { Edge, Flow, Node } from "./types";
let FLOWID = "DUMMY_FLOW";

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
  data: { question: string; answer: string; isLoading?: boolean },
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

// Updates a node's answer in localStorage after streaming completes
export const updateNodeAnswer = (
  flowId: string,
  nodeId: string,
  answer: string,
) => {
  const flow = loadFlow(flowId);
  if (!flow) return;

  const node = flow.nodes.find((n) => n.id === nodeId);
  if (!node) return;

  node.data.answer = answer;
  node.data.isLoading = false;
  saveFlow(flowId, flow);
};
