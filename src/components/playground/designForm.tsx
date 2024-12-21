import { DeepPartial } from 'ai';
import { FormValues, NewDesignForm } from '../newDesignForm';
import { StreamableRoastedDesign } from '@/types/roastedDesign';
import { Button } from '../ui/button';
import { RxReload } from 'react-icons/rx';
import { useCallback, useEffect, useState } from 'react';

interface DesignFormProps {
  onSubmit: (values: FormValues) => void;
  streamableRoastedDesign?: DeepPartial<StreamableRoastedDesign>;
  isStreamingComplete?: boolean;
  isLoading?: boolean;
  onRoastAgain: () => void;
}

export function DesignForm({
  onSubmit,
  streamableRoastedDesign,
  isStreamingComplete,
  onRoastAgain,
  isLoading,
}: DesignFormProps) {
  const [isShowForm, setIsShowForm] = useState(true);

  const handleToggleShowForm = useCallback(() => {
    setIsShowForm((prev) => !prev);
  }, [setIsShowForm]);

  useEffect(() => {
    if (isLoading) {
      setIsShowForm(false);
    }
  }, [isLoading]);

  return (
    <div className="flex justify-center flex-col gap-10 w-full">
      {isStreamingComplete && (
        <div className="flex justify-center gap-2">
          <Button
            variant="default"
            className="flex items-center gap-1"
            onClick={onRoastAgain}
          >
            Roast Again <RxReload />
          </Button>
          <Button
            variant="secondary"
            className="flex items-center gap-1"
            onClick={handleToggleShowForm}
          >
            {isShowForm ? 'Hide form' : 'Update design'}
          </Button>
        </div>
      )}
      <div className="flex justify-center gap-2 w-full">
        {isShowForm && <NewDesignForm onSubmit={onSubmit} />}
      </div>
    </div>
  );
}
