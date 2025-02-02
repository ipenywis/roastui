import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
} from '@xyflow/react';
import { FlowNodeTypes, getAllEdges } from './nodes';
import { ArrowNode } from './arrowNode';
import { MainDesignNode } from './mainDesignNode';
import { RoastedDesigns } from '@prisma/client';
import {
  getCoordinatesFromElements,
  getHighlightedPreviewElements,
  PreviewHighlightCoordinates,
} from '@/lib/preview';
import { useEffect, useMemo, useState } from 'react';
import { useDesignPreviewStore } from '@/lib/providers/designPreviewStoreProvider';
import { useFlowNodes } from './useFlowNodes';
import { XAxisDebugNode, YAxisDebugNode } from './axisDebugNode';
import { MainDesignNodeDynamic } from '@/components/previewView/previewFlow/mainDesignNodeDynamic';
import { usePreviewFullScreenMode } from '@/hooks/usePreviewFullScreenMode';
import { usePreviewViewStore } from '@/lib/providers/previewViewStoreProvider';

const nodeTypes = {
  [FlowNodeTypes.MainDesignNode]: MainDesignNode,
  [FlowNodeTypes.MainDesignNodeDynamic]: MainDesignNodeDynamic,
  [FlowNodeTypes.ArrowNode]: ArrowNode,
  [FlowNodeTypes.XAxisDebugNode]: XAxisDebugNode,
  [FlowNodeTypes.YAxisDebugNode]: YAxisDebugNode,
};

const BACKGROUND_COLORS = {
  black: '#0f0f0f',
  figmaGray: '#1E1E1E',
};

interface PreviewFlowProps {
  roastedDesign: RoastedDesigns;
}

export function PreviewFlow(props: PreviewFlowProps) {
  const { roastedDesign } = props;

  const [arrowsCoordinates, setArrowsCoordinates] = useState<
    PreviewHighlightCoordinates[]
  >([]);

  const isImprovementsHighlightActive = useDesignPreviewStore(
    (state) => state.isImprovementsHighlightActive,
  );

  const { nodes, updateNodes } = useFlowNodes(
    roastedDesign,
    arrowsCoordinates,
    { enableImprovementsHighlight: isImprovementsHighlightActive },
  );

  const edges = useMemo(
    () =>
      getAllEdges(arrowsCoordinates, {
        enableImprovementsHighlight: isImprovementsHighlightActive,
      }),
    [arrowsCoordinates, isImprovementsHighlightActive],
  );

  const { isPreviewFullScreenMode } = usePreviewFullScreenMode();
  const renderingStatus = usePreviewViewStore((store) => store.renderingStatus);

  useEffect(() => {
    //Timeout is needed to allow html to paint before getting coordinates
    if (renderingStatus === 'success') {
      setTimeout(() => {
        const elements = getHighlightedPreviewElements(
          JSON.parse(roastedDesign.uiHighlights).improvements,
        );
        const newCoordinates = getCoordinatesFromElements(elements);
        setArrowsCoordinates(newCoordinates);
      }, 400);
    }
  }, [roastedDesign.uiHighlights, isPreviewFullScreenMode, renderingStatus]);

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
      {/* Figma's background color */}
      <Background
        variant={BackgroundVariant.Dots}
        color="#fff00"
        bgColor={BACKGROUND_COLORS.figmaGray}
      />
    </ReactFlow>
  );
}
