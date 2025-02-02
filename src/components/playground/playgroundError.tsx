import { Typography } from '../ui/typography';

export function PlaygroundError({ error }: { error: Error | null }) {
  if (!error) return null;

  return (
    <div className="flex items-center justify-center">
      <Typography variant="small" color="danger" className="font-bold">
        Error: {error.message}
      </Typography>
    </div>
  );
}
