'use client';

import { RoastedDesigns } from '@prisma/client';
import { StreamingPlayground } from './streamingPlayground';

interface PlaygroundProps {
  initialRoastedDesign?: RoastedDesigns;
}

export default function Playground(props: PlaygroundProps) {
  return (
    <StreamingPlayground initialRoastedDesign={props.initialRoastedDesign} />
  );
}
