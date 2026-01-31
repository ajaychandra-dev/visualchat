"use client";

import { Edge } from "@xyflow/react";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { getFlow } from "../api/createNode";
import { Node } from "../api/types";
import getLayoutedElements from "../utils/dagre-layout";

type AppContextType = {
  nodes: Node[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  edges: Edge[];
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  useEffect(() => {
    const flow = getFlow("DUMMY_FLOW");
    if (!flow) return;
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      flow.nodes,
      flow.edges,
    );

    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, []);

  return (
    <AppContext.Provider value={{ nodes, setNodes, edges, setEdges }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
