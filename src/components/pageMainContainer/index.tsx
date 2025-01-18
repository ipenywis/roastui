import { cva } from 'class-variance-authority';
import { ReactNode } from 'react';

const container = cva('relative flex flex-col overflow-x-hidden');

const containerInner = cva('flex flex-col w-full px-4 lg:p-0');

export function PageMainContainer({ children }: { children: ReactNode }) {
  return <div className={container()}>{children}</div>;
}

export function PageMainContainerInner({ children }: { children: ReactNode }) {
  return <div className={containerInner()}>{children}</div>;
}
