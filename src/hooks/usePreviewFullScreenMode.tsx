import { useCallback } from 'react';
import useLocalStorageState from 'use-local-storage-state';

export function usePreviewFullScreenMode() {
  const [isPreviewFullScreenMode, setIsPreviewFullScreenMode] =
    useLocalStorageState('isPreviewFullScreenMode', {
      defaultValue: false,
    });

  const handleToggleFullScreenMode = useCallback(
    (element: HTMLElement | null) => {
      if (isPreviewFullScreenMode) {
        element?.requestFullscreen();
      } else if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    },
    [isPreviewFullScreenMode]
  );

  return {
    isPreviewFullScreenMode,
    setIsPreviewFullScreenMode,
    handleToggleFullScreenMode,
  };
}
