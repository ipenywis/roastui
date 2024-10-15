import appConfig from '@/config/app';
import { cva } from 'class-variance-authority';
import Link from 'next/link';

const container = cva('flex gap-x-10');

const item = cva('text-white font-normal text-lg');

export function NavigationMenu() {
  return (
    <ul className={container()}>
      {appConfig.navigationMenu.map((menuItem, idx) => (
        <Link className={item()} href={menuItem.url} key={idx}>
          {menuItem.item}
        </Link>
      ))}
    </ul>
  );
}
