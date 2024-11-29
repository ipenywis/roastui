import { applyNodeChanges, Node, NodeChange } from '@xyflow/react';
import { RoastedDesigns } from '@prisma/client';
import { PreviewHighlightCoordinates } from '@/lib/preview';
import { useCallback, useMemo, useState } from 'react';
import { getAllNodes } from './nodes';

interface UseFlowNodesOptions {
  enableImprovementsHighlight: boolean;
}

export function useFlowNodes(
  roastedDesign: RoastedDesigns,
  arrowsCoordinates: PreviewHighlightCoordinates[],
  options: UseFlowNodesOptions
) {
  const [nodes, setNodes] = useState<Node[]>([]);

  const initialNodes = useMemo(
    () =>
      getAllNodes(roastedDesign, arrowsCoordinates, {
        enableImprovementsHighlight: options.enableImprovementsHighlight,
      }),
    [roastedDesign, arrowsCoordinates, options.enableImprovementsHighlight]
  );

  // Initialize nodes on first render
  useMemo(() => {
    setNodes(initialNodes);
  }, [initialNodes]);

  const updateNodes = useCallback((changes: NodeChange[]) => {
    setNodes((currentNodes) => applyNodeChanges(changes, currentNodes));
  }, []);

  return {
    nodes,
    updateNodes,
  };
}
