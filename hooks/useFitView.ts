// hooks/use-fit-view-to-selection.ts
import { useAppContext } from "@/app/context/context";
import { useReactFlow } from "@xyflow/react";
import { useEffect } from "react";

export const useFitView = (options?: {
  padding?: { top: number; right: number; bottom: number; left: number };
  maxNodesToFitAll?: number;
}) => {
  const { fitView, setCenter } = useReactFlow();
  const { nodes, edges } = useAppContext(); // Get from context directly

  const padding = options?.padding ?? {
    top: 0.2,
    right: 0.2,
    bottom: 0.75,
    left: 0.2,
  };
  const maxNodesToFitAll = options?.maxNodesToFitAll ?? 1;

  useEffect(() => {
    if (!nodes.length) return;

    if (nodes.length <= maxNodesToFitAll) {
      fitView({ padding });
      return;
    }

    const selectedNode = nodes.find((node) => node.selected);

    if (!selectedNode) {
      fitView({ padding });
      return;
    }

    setCenter(selectedNode.position.x + 200, selectedNode.position.y + 250, {
      zoom: 1.5,
      duration: 150,
    });
  }, [nodes, edges, fitView, padding, maxNodesToFitAll]);
};
