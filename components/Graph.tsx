"use client";

import { useAppContext } from "@/app/context/context";
import { useFitView } from "@/hooks/useFitView";
import {
  applyNodeChanges,
  Background,
  BackgroundVariant,
  ReactFlow
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback } from "react";
import BaseNode from "./BaseNode";

import EmptyState from "./EmptyState";

const nodeTypes = {
  BaseNode: BaseNode,
};

export default function Graph() {
  const { nodes, setNodes, edges } = useAppContext();
  useFitView();

  const onNodesChange = useCallback(
    (changes: any) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );

  return (
    <div className="h-full w-full relative">
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

      {nodes.length === 0 && <EmptyState />}
    </div>
  );
}
