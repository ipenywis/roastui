const calculateArrowDimensions = (
  start: { x: number; y: number },
  end: { x: number; y: number },
) => {
  // Calculate the dimensions needed for the SVG
  const minX = Math.min(start.x, end.x);
  const minY = Math.min(start.y, end.y);
  const maxX = Math.max(start.x, end.x);
  const maxY = Math.max(start.y, end.y);
  const width = maxX - minX;
  const height = maxY - minY;

  // Calculate the angle for the arrow head
  const angle = Math.atan2(end.y - start.y, end.x - start.x);
  const arrowLength = 15; // Length of arrow head lines

  // Calculate arrow head points
  const arrowHead1 = {
    x: end.x - arrowLength * Math.cos(angle - Math.PI / 6),
    y: end.y - arrowLength * Math.sin(angle - Math.PI / 6),
  };
  const arrowHead2 = {
    x: end.x - arrowLength * Math.cos(angle + Math.PI / 6),
    y: end.y - arrowLength * Math.sin(angle + Math.PI / 6),
  };

  return {
    minX,
    minY,
    width,
    height,
    arrowHead1,
    arrowHead2,
  };
};

// Add padding to ensure arrow head is visible
const PADDING = 20;

interface PointingArrowProps {
  start: { x: number; y: number };
  end: { x: number; y: number };
  color?: string;
  strokeWidth?: number;
}

export function PointingArrow({
  start,
  end,
  color = '#FF5733',
  strokeWidth = 2,
}: PointingArrowProps) {
  const { minX, minY, width, height } = calculateArrowDimensions(start, end);

  return (
    <div
      style={{
        position: 'absolute',
        left: minX - PADDING,
        top: minY - PADDING,
        width: width + PADDING * 2,
        height: height + PADDING * 2,
        pointerEvents: 'none',
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox={`${-PADDING} ${-PADDING} ${width + PADDING * 2} ${
          height + PADDING * 2
        }`}
      >
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="5"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill={color} />
          </marker>
        </defs>
        <line
          x1={start.x - minX}
          y1={start.y - minY}
          x2={end.x - minX}
          y2={end.y - minY}
          stroke={color}
          strokeWidth={strokeWidth}
          markerEnd="url(#arrow)"
        />
      </svg>
    </div>
  );
}
