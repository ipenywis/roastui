import { PreviewHighlightCoordinates } from '@/lib/preview';
import { RoastedDesigns } from '@prisma/client';
import { Edge, MarkerType, Node } from '@xyflow/react';

export enum FlowNodeTypes {
  MainDesignNode = 'mainDesignNode',
  ArrowNode = 'arrowNode',
}

export interface PreviewFlowOptions {
  enableImprovementsHighlight: boolean;
}

const defaultPreviewFlowOptions: PreviewFlowOptions = {
  enableImprovementsHighlight: false,
};

function getImprovementsHighlightArrowsEdges(
  arrowsCoordinates: PreviewHighlightCoordinates[]
) {
  return arrowsCoordinates.map(
    (_, idx) =>
      ({
        id: `arrow-${idx}`,
        source: `arrow-start-${idx}`,
        target: `arrow-end-${idx}`,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          // color: '#FF0072',
        },
        style: {
          strokeWidth: 1,
          // stroke: '#FF0072',
        },
        zIndex: 20,
      } satisfies Edge)
  );
}

function getMainDesignNode(roastedDesign: RoastedDesigns) {
  return {
    id: 'main',
    position: { x: 0, y: 0 },
    data: { roastedDesign: roastedDesign },
    type: FlowNodeTypes.MainDesignNode,
    style: {
      zIndex: -1,
    },
    selectable: false,
    draggable: false,
    zIndex: -1,
  } satisfies Node;
}

function getArrowNodes(arrowsCoordinates: PreviewHighlightCoordinates[]) {
  const startArrowNodes = arrowsCoordinates?.map((arrowCoordinate, idx) => ({
    id: `arrow-start-${idx}`,
    position: { x: arrowCoordinate.start.x, y: arrowCoordinate.start.y },
    data: {
      arrowCoordinate,
      label: arrowCoordinate.description,
      isStart: true,
    },
    type: FlowNodeTypes.ArrowNode,
    label: `Start-${idx}`,
  }));

  const endArrowNodes = arrowsCoordinates?.map((arrowCoordinate, idx) => ({
    id: `arrow-end-${idx}`,
    position: { x: arrowCoordinate.end.x, y: arrowCoordinate.end.y },
    data: {
      arrowCoordinate,
      label: arrowCoordinate.description,
      isStart: false,
    },
    type: FlowNodeTypes.ArrowNode,
    label: `End-${idx}`,
  }));

  return [...startArrowNodes, ...endArrowNodes];
}

export function getAllNodes(
  roastedDesign: RoastedDesigns,
  arrowsCoordinates?: PreviewHighlightCoordinates[],
  options: PreviewFlowOptions = defaultPreviewFlowOptions
) {
  if (!arrowsCoordinates) return [];

  const mainDesignNode = getMainDesignNode(roastedDesign);

  if (!options.enableImprovementsHighlight) {
    return [mainDesignNode];
  }

  const arrowNodes = getArrowNodes(arrowsCoordinates);

  return [...arrowNodes, mainDesignNode];
}

export function getAllEdges(
  arrowsCoordinates: PreviewHighlightCoordinates[],
  options: PreviewFlowOptions = defaultPreviewFlowOptions
) {
  if (options.enableImprovementsHighlight) {
    return getImprovementsHighlightArrowsEdges(arrowsCoordinates);
  }

  return [];
}
