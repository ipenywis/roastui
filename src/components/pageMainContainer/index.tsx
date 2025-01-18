import { cva } from 'class-variance-authority';
import { ReactNode } from 'react';

const container = cva('relative flex flex-col px-4 lg:p-0 overflow-x-hidden');

export function PageMainContainer({ children }: { children: ReactNode }) {
  return <div className={container()}>{children}</div>;
}
