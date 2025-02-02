import { StreamableRoastedDesign } from '@/types/roastedDesign';
import { RoastedDesigns } from '@prisma/client';
import { createStore } from 'zustand/vanilla';

export type DesignPreviewState = {
  isImprovementsHighlightActive: boolean;
  isFullScreenMode: boolean;
  currentRoastedDesign: StreamableRoastedDesign | RoastedDesigns | null;
};

export type DesignPreviewActions = {
  setIsImprovementsHighlightActive: (isActive: boolean) => void;
  setIsFullScreenMode: (isActive: boolean) => void;
  setCurrentRoastedDesign: (
    roastedDesign: StreamableRoastedDesign | RoastedDesigns | null,
  ) => void;
};

export type DesignPreviewStore = DesignPreviewState & DesignPreviewActions;

export const defaultInitState: DesignPreviewState = {
  isImprovementsHighlightActive: false,
  isFullScreenMode: false,
  currentRoastedDesign: null,
};

export const createDesignPreviewStore = (
  initState: DesignPreviewState = defaultInitState,
) => {
  return createStore<DesignPreviewStore>()((set) => ({
    ...initState,
    setIsImprovementsHighlightActive: (isActive: boolean) =>
      set({ isImprovementsHighlightActive: isActive }),
    setIsFullScreenMode: (isActive: boolean) =>
      set({ isFullScreenMode: isActive }),
    setCurrentRoastedDesign: (roastedDesign) =>
      set({ currentRoastedDesign: roastedDesign }),
  }));
};
