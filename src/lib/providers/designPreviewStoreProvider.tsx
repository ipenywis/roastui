// src/providers/counter-store-provider.tsx
'use client';

import { type ReactNode, createContext, useRef, useContext } from 'react';
import { useStore } from 'zustand';

import {
  type DesignPreviewStore,
  createDesignPreviewStore,
} from '@/lib/stores/designPreviewStore';

export type DesignPreviewStoreApi = ReturnType<typeof createDesignPreviewStore>;

export const DesignPreviewStoreContext = createContext<
  DesignPreviewStoreApi | undefined
>(undefined);

export interface DesignPreviewStoreProviderProps {
  children: ReactNode;
}

export const DesignPreviewStoreProvider = ({
  children,
}: DesignPreviewStoreProviderProps) => {
  const storeRef = useRef<DesignPreviewStoreApi>();
  if (!storeRef.current) {
    storeRef.current = createDesignPreviewStore();
  }

  return (
    <DesignPreviewStoreContext.Provider value={storeRef.current}>
      {children}
    </DesignPreviewStoreContext.Provider>
  );
};

export const useDesignPreviewStore = <T,>(
  selector: (store: DesignPreviewStore) => T
): T => {
  const designPreviewStoreContext = useContext(DesignPreviewStoreContext);

  if (!designPreviewStoreContext) {
    throw new Error(
      `useDesignPreviewStore must be used within DesignPreviewStoreProvider`
    );
  }

  return useStore(designPreviewStoreContext, selector);
};
