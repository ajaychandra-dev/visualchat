"use client";

import { useAppContext } from "@/app/context/context";
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

  useEffect(() => {
    if (!nodes.length) return;

    const padding = { top: 0.2, right: 0.2, bottom: 0.75, left: 0.2 };

    if (nodes.length <= 3) {
      fitView({ padding });
    } else {
      const lastThreeNodes = nodes.slice(-3);

      fitView({
        nodes,
        padding,
      });
    }
  }, [nodes.length, fitView]);

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
        minZoom={0.2}
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
