import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { useCallback } from 'react';
import { RiArrowLeftLine } from 'react-icons/ri';
import { cva } from 'class-variance-authority';

const container = cva('flex items-center justify-start w-full', {
  variants: {
    isHidden: {
      true: 'invisible',
    },
  },
  defaultVariants: {
    isHidden: false,
  },
});

interface GoBackButtonProps {
  isHidden?: boolean;
}

export function GoBackButton({ isHidden }: GoBackButtonProps) {
  const router = useRouter();

  const handleGoBack = useCallback(() => {
    router.back();
  }, []);

  return (
    <div className={container({ isHidden })}>
      <Button onClick={handleGoBack} variant="link" className="gap-1">
        <RiArrowLeftLine className="size-4" /> Back
      </Button>
    </div>
  );
}
