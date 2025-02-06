import { cva } from 'class-variance-authority';
import { Logo } from '../logo';
import Link from 'next/link';
import { Button } from '../ui/button';
import appConfig from '@/config/app';

const container = cva(
  'flex justify-between lg:justify-around items-center px-4 lg:px-8 py-6 z-40',
);

const navigationContainer = cva('flex gap-x-10');

const navigationItem = cva(
  'text-slate-300 hover:text-slate-100 transition-all duration-150 font-normal text-lg',
);

const buttonsContainer = cva(
  'flex gap-x-3 items-center focus-visible:outline-none outline-none focus-within:outline-none',
);

export function StandardNavbar() {
  return (
    <div className={container()}>
      <Link href="/">
        <Logo />
      </Link>
      <div className="flex items-center gap-x-10">
        <ul className={navigationContainer()}>
          {appConfig.navigationMenu.map((menuItem, idx) => (
            <Link className={navigationItem()} href={menuItem.url} key={idx}>
              {menuItem.item}
            </Link>
          ))}
        </ul>
      </div>
      <div className={buttonsContainer()}>
        <Link href="/login">
          <Button variant="ghost">Login</Button>
        </Link>
        <Link href="/signup">
          <Button variant="default">Signup</Button>
        </Link>
      </div>
    </div>
  );
}
