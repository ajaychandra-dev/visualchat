"use client";

import { useAppContext } from "@/app/context/context";
import { isNonEmptyArray } from "@/app/utils/array";
import {
  applyNodeChanges,
  Background,
  BackgroundVariant,
  ReactFlow,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useEffect, useState } from "react";
import BaseNode from "./BaseNode";

const initialEdges = [{ id: "n1-n2", source: "n1", target: "n2" }];

const nodeTypes = {
  BaseNode: BaseNode,
};

export default function Graph() {
  const { fitView } = useReactFlow();
  const { data } = useAppContext();
  const [nodes, setNodes] = useState(data?.nodes ?? []);
  const [edges, setEdges] = useState(initialEdges);

  useEffect(() => {
    if (data === null) {
      return;
    }
    if (isNonEmptyArray(data.nodes)) {
      setNodes(data.nodes);
      if (isNonEmptyArray(data.edges)) {
        setEdges(data.edges);
      }
    }
  }, [data]);

  useEffect(() => {
    if (nodes.length >= 2) {
      fitView();
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
