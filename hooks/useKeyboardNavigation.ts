// hooks/use-keyboard-navigation.ts
import { useAppContext } from "@/app/context/context";
import { useEffect } from "react";

export const useKeyboardNavigation = () => {
  const { nodes, setNodes, edges } = useAppContext();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)
      ) {
        return;
      }

      const activeElement = document.activeElement;
      if (
        activeElement?.tagName === "INPUT" ||
        activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      e.preventDefault();

      const selectedNode = nodes.find((node) => node.selected);
      if (!selectedNode) {
        if (nodes.length > 0) {
          setNodes(nodes.map((n, i) => ({ ...n, selected: i === 0 })));
        }
        return;
      }

      let targetNodeId: string | null = null;

      // Get children of current node
      const childEdges = edges.filter(
        (edge) => edge.source === selectedNode.id,
      );
      const hasBranch = childEdges.length > 1;

      switch (e.key) {
        case "ArrowLeft": {
          // Always go to parent
          const parentEdge = edges.find(
            (edge) => edge.target === selectedNode.id,
          );
          targetNodeId = parentEdge?.source ?? null;
          break;
        }

        case "ArrowRight": {
          // Go to topmost child (or only child)
          if (childEdges.length > 0) {
            const children = nodes
              .filter((node) =>
                childEdges.some((edge) => edge.target === node.id),
              )
              .sort((a, b) => a.position.y - b.position.y);
            targetNodeId = children[0].id; // Topmost child
          }
          break;
        }

        case "ArrowUp": {
          // Only works at branching points - go to topmost child
          if (hasBranch) {
            const children = nodes
              .filter((node) =>
                childEdges.some((edge) => edge.target === node.id),
              )
              .sort((a, b) => a.position.y - b.position.y);
            targetNodeId = children[0].id; // Topmost child
          }
          break;
        }

        case "ArrowDown": {
          // Only works at branching points - go to bottommost child
          if (hasBranch) {
            const children = nodes
              .filter((node) =>
                childEdges.some((edge) => edge.target === node.id),
              )
              .sort((a, b) => a.position.y - b.position.y);
            targetNodeId = children[children.length - 1].id; // Bottommost child
          }
          break;
        }
      }

      if (targetNodeId) {
        setNodes(
          nodes.map((node) => ({
            ...node,
            selected: node.id === targetNodeId,
          })),
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nodes, edges, setNodes]);
};
