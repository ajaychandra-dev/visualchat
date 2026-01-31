// hooks/use-fit-view-to-selection.ts
import { useAppContext } from "@/app/context/context";
import { useReactFlow } from "@xyflow/react";
import { useEffect } from "react";

export const useFitView = (options?: {
  padding?: { top: number; right: number; bottom: number; left: number };
  maxNodesToFitAll?: number;
}) => {
  const { fitView, setCenter, getZoom } = useReactFlow();
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
    const currentZoom = getZoom();

    setCenter(
      selectedNode.position.x + 75, // Adjust based on your node width (nodeWidth / 2)
      selectedNode.position.y + 75, // Adjust based on your node height (nodeHeight / 2)
      {
        zoom: currentZoom,
        duration: 150,
      },
    );
  }, [nodes, edges, fitView, padding, maxNodesToFitAll, getZoom, setCenter]);
};
