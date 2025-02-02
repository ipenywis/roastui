import { cva } from 'class-variance-authority';
import { ReactNode } from 'react';

const container = cva('relative flex flex-col size-full overflow-x-hidden');

const containerInner = cva('flex flex-col w-full px-4 lg:p-0');

export function PageMainContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={container({ className })}>{children}</div>;
}

export function PageMainContainerInner({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={containerInner({ className })}>{children}</div>;
}
