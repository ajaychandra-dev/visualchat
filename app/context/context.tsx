"use client";

import { Edge } from "@xyflow/react";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import getLayoutedElements from "../../utils/dagre-layout";
import { getFlow } from "../api/createNode";
import { Node } from "../api/types";

type AppContextType = {
  nodes: Node[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  edges: Edge[];
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  refresh: boolean;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [refresh, setRefresh] = useState<boolean>(false);

  useEffect(() => {
    const flow = getFlow("DUMMY_FLOW");
    if (!flow) {
      setNodes([]);
      setEdges([]);
      setRefresh(false);
      return;
    }
    const nodesWithSelection = flow.nodes.map((node, index) => ({
      ...node,
      selected: index === flow.nodes.length - 1, // Select last node
    }));
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      nodesWithSelection,
      flow.edges,
    );
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [refresh]);

  return (
    <AppContext.Provider
      value={{ nodes, setNodes, edges, setEdges, refresh, setRefresh }}
    >
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
