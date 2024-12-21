import { Typography } from '@/components/ui/typography';
import { Typewriter } from '../ui/typewriter';
import { RiLoader3Line } from 'react-icons/ri';

export function StreamingLoading() {
  return (
    <div className="flex items-center justify-center gap-2">
      <Typewriter text="Hey there, hang tight while we roast your design...">
        {(text) => (
          <Typography variant="p" color="muted">
            {text}
          </Typography>
        )}
      </Typewriter>
      <RiLoader3Line className="size-4 animate-spin" />
    </div>
  );
}
