import { Background, Controls, ReactFlow } from '@xyflow/react';
import { FlowNodeTypes, getAllEdges, getAllNodes } from './nodes';
import { ArrowNode } from './arrowNode';
import { MainDesignNode } from './mainDesignNode';
import { RoastedDesigns } from '@prisma/client';
import { PreviewHighlightCoordinates } from '@/lib/preview';
import { useMemo } from 'react';
import { useDesignPreviewStore } from '@/lib/providers/designPreviewStoreProvider';

const nodeTypes = {
  [FlowNodeTypes.MainDesignNode]: MainDesignNode,
  [FlowNodeTypes.ArrowNode]: ArrowNode,
};

interface PreviewFlowProps {
  roastedDesign: RoastedDesigns;
  arrowsCoordinates: PreviewHighlightCoordinates[];
}

export function PreviewFlow(props: PreviewFlowProps) {
  const { roastedDesign, arrowsCoordinates } = props;

  const isImprovementsHighlightActive = useDesignPreviewStore(
    (state) => state.isImprovementsHighlightActive
  );

  const nodes = useMemo(
    () =>
      getAllNodes(roastedDesign, arrowsCoordinates, {
        enableImprovementsHighlight: isImprovementsHighlightActive,
      }),
    [roastedDesign, arrowsCoordinates, isImprovementsHighlightActive]
  );
  const edges = useMemo(
    () =>
      getAllEdges(arrowsCoordinates, {
        enableImprovementsHighlight: isImprovementsHighlightActive,
      }),
    [arrowsCoordinates, isImprovementsHighlightActive]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      proOptions={{ hideAttribution: true }}
      defaultEdgeOptions={{ type: 'smoothstep' }}
      maxZoom={4}
      minZoom={0.5}
      fitView
    >
      <Controls />
      <Background />
    </ReactFlow>
  );
}
