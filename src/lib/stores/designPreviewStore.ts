// src/stores/counter-store.ts
import { createStore } from 'zustand/vanilla';

export type DesignPreviewState = {
  isImprovementsHighlightActive: boolean;
  isFullScreenMode: boolean;
};

export type DesignPreviewActions = {
  setIsImprovementsHighlightActive: (isActive: boolean) => void;
  setIsFullScreenMode: (isActive: boolean) => void;
};

export type DesignPreviewStore = DesignPreviewState & DesignPreviewActions;

export const defaultInitState: DesignPreviewState = {
  isImprovementsHighlightActive: false,
  isFullScreenMode: false,
};

export const createDesignPreviewStore = (
  initState: DesignPreviewState = defaultInitState
) => {
  return createStore<DesignPreviewStore>()((set) => ({
    ...initState,
    setIsImprovementsHighlightActive: (isActive: boolean) =>
      set({ isImprovementsHighlightActive: isActive }),
    setIsFullScreenMode: (isActive: boolean) =>
      set({ isFullScreenMode: isActive }),
  }));
};
