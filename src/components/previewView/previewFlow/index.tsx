import { Background, Controls, ReactFlow } from '@xyflow/react';
import { FlowNodeTypes, getAllEdges } from './nodes';
import { ArrowNode } from './arrowNode';
import { MainDesignNode } from './mainDesignNode';
import { RoastedDesigns } from '@prisma/client';
import { PreviewHighlightCoordinates } from '@/lib/preview';
import { useMemo } from 'react';
import { useDesignPreviewStore } from '@/lib/providers/designPreviewStoreProvider';
import { useFlowNodes } from './useFlowNodes';

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

  const { nodes, updateNodes } = useFlowNodes(
    roastedDesign,
    arrowsCoordinates,
    { enableImprovementsHighlight: isImprovementsHighlightActive }
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
      onNodesChange={updateNodes}
      maxZoom={4}
      minZoom={0.5}
      fitView
    >
      <Controls />
      <Background />
    </ReactFlow>
  );
}
