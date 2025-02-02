import { Handle, NodeProps, Position } from '@xyflow/react';
import { PreviewHighlightCoordinates } from '@/lib/preview';
import { getCoordinatesSide } from '@/lib/preview';
import { InfoLabel } from './infoLabel';

interface ArrowNodeProps extends NodeProps {
  data: {
    isStart: boolean;
    arrowCoordinate: PreviewHighlightCoordinates;
    label: string;
  };
}

export function ArrowNode(props: ArrowNodeProps) {
  const {
    data: { isStart, arrowCoordinate, label },
  } = props;

  const elementSide = getCoordinatesSide(arrowCoordinate);

  return (
    <div className="flex flex-col items-center justify-center h-4 relative border border-transparent">
      <Handle
        type={elementSide === 'left' ? 'source' : 'target'}
        position={Position.Right}
        className="bg-transparent stroke-transparent text-transparent border-transparent"
        isConnectable={false}
        isConnectableEnd={false}
        isConnectableStart={false}
      />
      {isStart && <InfoLabel elementSide={elementSide}>{label}</InfoLabel>}
      <Handle
        type={elementSide === 'left' ? 'target' : 'source'}
        position={Position.Left}
        className="bg-transparent stroke-transparent text-transparent border-transparent"
        isConnectable={false}
        isConnectableEnd={false}
        isConnectableStart={false}
      />
    </div>
  );
}
