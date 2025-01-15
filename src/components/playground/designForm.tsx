import { FormValues, NewDesignForm } from '../newDesignForm';
import { Button } from '../ui/button';
import { RxReload } from 'react-icons/rx';
import { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useUser } from '@/lib/queryHooks/user/queries';

interface DesignFormProps {
  onSubmit: (values: FormValues) => void;
  isStreamingComplete?: boolean;
  isLoading?: boolean;
  onRoastAgain: () => void;
  isUpdateMode?: boolean;
  initialIsShowForm?: boolean;
}

export function DesignForm({
  onSubmit,
  isStreamingComplete,
  onRoastAgain,
  isLoading,
  isUpdateMode,
  initialIsShowForm = true,
}: DesignFormProps) {
  const [isShowForm, setIsShowForm] = useState(initialIsShowForm);

  const { data: userData } = useUser();

  const isSubscriptionActive = userData?.user?.subscription?.isActive ?? false;

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
      {isStreamingComplete && isSubscriptionActive && (
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
        {isShowForm && (
          <NewDesignForm
            onSubmit={onSubmit}
            mode={isUpdateMode ? 'update' : 'create'}
          />
        )}
      </div>
    </div>
  );
}
