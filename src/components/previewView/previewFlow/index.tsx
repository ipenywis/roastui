import { Background, Controls, ReactFlow } from '@xyflow/react';
import { FlowNodeTypes, getAllEdges, getAllNodes } from './nodes';
import { ArrowNode } from './arrowNode';
import { MainDesignNode } from './mainDesignNode';
import { RoastedDesigns } from '@prisma/client';
import { PreviewHighlightCoordinates } from '@/lib/preview';

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
  const nodes = getAllNodes(roastedDesign, arrowsCoordinates);
  const edges = getAllEdges(arrowsCoordinates);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      proOptions={{ hideAttribution: true }}
      maxZoom={4}
      minZoom={0.5}
      fitView
    >
      <Controls />
      <Background />
    </ReactFlow>
  );
}
