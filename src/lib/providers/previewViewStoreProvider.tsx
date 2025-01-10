'use client';

import { type ReactNode, createContext, useRef, useContext } from 'react';
import { useStore } from 'zustand';

import {
  type PreviewViewStore,
  createPreviewViewStore,
} from '@/lib/stores/previewViewStore';

export type PreviewViewStoreApi = ReturnType<typeof createPreviewViewStore>;

export const PreviewViewStoreContext = createContext<
  PreviewViewStoreApi | undefined
>(undefined);

export interface PreviewViewStoreProviderProps {
  children: ReactNode;
}

export const PreviewViewStoreProvider = ({
  children,
}: PreviewViewStoreProviderProps) => {
  const storeRef = useRef<PreviewViewStoreApi>();
  if (!storeRef.current) {
    storeRef.current = createPreviewViewStore();
  }

  return (
    <PreviewViewStoreContext.Provider value={storeRef.current}>
      {children}
    </PreviewViewStoreContext.Provider>
  );
};

export const usePreviewViewStore = <T,>(
  selector: (store: PreviewViewStore) => T,
): T => {
  const previewViewStoreContext = useContext(PreviewViewStoreContext);

  if (!previewViewStoreContext) {
    throw new Error(
      `usePreviewViewStore must be used within PreviewViewStoreProvider`,
    );
  }

  return useStore(previewViewStoreContext, selector);
};
