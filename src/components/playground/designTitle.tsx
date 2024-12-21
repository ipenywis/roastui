import { Typewriter } from '../ui/typewriter';
import { Typography } from '../ui/typography';

interface StreamingDesignTitleProps {
  name?: string;
  disableStreaming?: boolean;
}

export function StreamingDesignTitle({
  name,
  disableStreaming,
}: StreamingDesignTitleProps) {
  if (!name)
    return (
      <Typography variant="h2" as="h1">
        Roast New Design
      </Typography>
    );

  if (disableStreaming)
    return (
      <Typography variant="h2" as="h1">
        Design: {name}
      </Typography>
    );

  return (
    <Typewriter text={`Design: ${name}`}>
      {(chunk) => (
        <Typography variant="h2" as="h1">
          {chunk}
        </Typography>
      )}
    </Typewriter>
  );
}
