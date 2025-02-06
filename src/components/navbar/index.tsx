import { cva } from 'class-variance-authority';
import { Logo } from '../logo';
import Link from 'next/link';
import { Menu } from './menu';

const container = cva(
  'flex justify-between lg:justify-around items-center px-4 lg:px-8 py-6 z-40',
);

export function Navbar() {
  return (
    <div className={container()}>
      <Link href="/dashboard">
        <Logo />
      </Link>
      <Menu />
    </div>
  );
}
