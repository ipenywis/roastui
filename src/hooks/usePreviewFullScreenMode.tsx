import { useCallback, useEffect } from 'react';
import useLocalStorageState from 'use-local-storage-state';

export function usePreviewFullScreenMode() {
  const [isPreviewFullScreenMode, setIsPreviewFullScreenMode] =
    useLocalStorageState('isPreviewFullScreenMode', {
      defaultValue: false,
    });

  const handleToggleFullScreenMode = useCallback(
    (element: HTMLElement | null) => {
      if (!element) {
        if (isPreviewFullScreenMode) {
          setIsPreviewFullScreenMode(false);
        }
        return;
      }

      if (isPreviewFullScreenMode) {
        element?.requestFullscreen();
      } else if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    },
    [isPreviewFullScreenMode],
  );

  const handleFullscreenChange = useCallback(() => {
    // Sync the state with actual fullscreen status
    setIsPreviewFullScreenMode(!!document.fullscreenElement);
  }, [setIsPreviewFullScreenMode]);

  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    // Clean up the event listener when component unmounts
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [handleFullscreenChange]);

  return {
    isPreviewFullScreenMode,
    setIsPreviewFullScreenMode,
    handleToggleFullScreenMode,
  };
}
