import { createStore } from 'zustand/vanilla';

export type PreviewViewState = {
  renderingStatus: 'idle' | 'pending' | 'success' | 'error';
};

export type PreviewViewActions = {
  setRenderingStatus: (status: PreviewViewState['renderingStatus']) => void;
};

export type PreviewViewStore = PreviewViewState & PreviewViewActions;

export const defaultInitState: PreviewViewState = {
  renderingStatus: 'idle',
};

export const createPreviewViewStore = (
  initState: PreviewViewState = defaultInitState,
) => {
  return createStore<PreviewViewStore>()((set) => ({
    ...initState,
    setRenderingStatus: (status) => set({ renderingStatus: status }),
  }));
};
