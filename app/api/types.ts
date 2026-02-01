export type Node = {
  id: string;
  type: "BaseNode";
  position: { x: number; y: number };
  data: {
    question: string;
    answer: string;
    isLoading?: boolean;
    error?: string;
  };
  selected?: boolean;
  measured?: { width?: number; height?: number };
};

export type Edge = {
  id: string;
  source: string;
  target: string;
  markerStart: string;
  markerEnd: string;
  type: string;
  style: { stroke: string; strokeWidth: number };
};

export type Flow = {
  id: string;
  name: string;
  nodes: Node[];
  edges: Edge[];
};
