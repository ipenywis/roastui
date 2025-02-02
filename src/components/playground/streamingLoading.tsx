import { Typography } from '@/components/ui/typography';
import { Typewriter } from '../ui/typewriter';
import { RiLoader3Line } from 'react-icons/ri';
import { memo, useCallback, useState } from 'react';

export const StreamingLoading = memo(function StreamingLoading() {
  const [isShowLoading, setIsShowLoading] = useState(false);

  const handleTypewriterComplete = useCallback(() => {
    setIsShowLoading(true);
  }, []);

  return (
    <div className="flex items-center justify-center gap-2">
      <Typewriter
        text="Hang tight while we roast your design..."
        onComplete={handleTypewriterComplete}
      >
        {(text) => (
          <Typography variant="large" color="muted" className="font-normal">
            {text}
          </Typography>
        )}
      </Typewriter>
      {isShowLoading && <RiLoader3Line className="size-4 animate-spin" />}
    </div>
  );
});
