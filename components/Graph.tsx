"use client";

import { useAppContext } from "@/app/context/context";
import { useFitView } from "@/hooks/useFitView";
import {
  applyNodeChanges,
  Background,
  BackgroundVariant,
  ReactFlow,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useEffect } from "react";
import BaseNode from "./BaseNode";

const nodeTypes = {
  BaseNode: BaseNode,
};

export default function Graph() {
  const { fitView } = useReactFlow();
  const { nodes, setNodes, edges } = useAppContext();
  useFitView();
  // useKeyboardNavigation();

  useEffect(() => {
    if (!nodes.length) return;

    const padding = { top: 0.2, right: 0.2, bottom: 0.75, left: 0.2 };

    if (nodes.length <= 3) {
      fitView({ padding });
      return;
    }

    const selectedNode = nodes.find((node) => node.selected);

    if (!selectedNode) {
      // No selection - fall back to showing all
      fitView({ padding });
      return;
    }

    // Find the parent node by looking for the edge that points TO the selected node
    const parentEdge = edges.find((edge) => edge.target === selectedNode.id);

    if (!parentEdge) {
      // Selected node is a root node (no parent) - just show it
      fitView({ nodes: [selectedNode], padding });
      return;
    }

    // Find the actual parent node using the edge's source
    const parentNode = nodes.find((node) => node.id === parentEdge.source);

    const nodesToFit = parentNode ? [parentNode, selectedNode] : [selectedNode];

    fitView({ nodes: nodesToFit, padding });
  }, [nodes.length, edges, fitView]); // Added edges to dependencies

  const onNodesChange = useCallback(
    (changes: any) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );

  return (
    <div className="h-full w-full">
      <svg style={{ position: "absolute", top: 0, left: 0 }}>
        <defs>
          <marker
            id="circle"
            markerWidth="4"
            markerHeight="4"
            refX="2"
            refY="2"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <circle cx="2" cy="2" r="2" fill="#7f7f86" />
          </marker>
        </defs>
      </svg>

      <ReactFlow
        proOptions={{ hideAttribution: true }}
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        fitView
        edgesFocusable={false}
        minZoom={0.3}
        maxZoom={1.75}
        nodesDraggable={false}
        nodesConnectable={false}
      >
        <Background
          variant={BackgroundVariant.Dots}
          color="#333333"
          gap={20}
          size={2}
        />
      </ReactFlow>
    </div>
  );
}
