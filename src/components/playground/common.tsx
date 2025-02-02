import { cva } from 'class-variance-authority';

export const container = cva(
  'size-full flex flex-col p-8 items-center relative pb-12',
);

export const innerContainer = cva(
  'size-full flex flex-col gap-4 max-w-screen-lg items-center',
);

export const title = cva('text-3xl font-bold');
