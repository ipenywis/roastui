'use client';

import appConfig from '@/config/app';
import { cva } from 'class-variance-authority';
import Link from 'next/link';
import { AccessControls } from './accessControls';

const container = cva('flex gap-x-10');

const item = cva(
  'text-slate-300 hover:text-slate-100 transition-all duration-150 font-normal text-lg',
);

export function NavigationMenu() {
  return (
    <>
      <ul className={container()}>
        {appConfig.navigationMenu.map((menuItem, idx) => (
          <Link className={item()} href={menuItem.url} key={idx}>
            {menuItem.item}
          </Link>
        ))}
      </ul>
      <AccessControls />
    </>
  );
}
