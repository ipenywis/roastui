import { cva } from 'class-variance-authority';
import { Logo } from '../logo';
import { NavigationMenu } from '../navigationMenu';
import { AccessControls } from './accessControls';
import Link from 'next/link';

const container = cva('flex justify-around items-center px-8 py-6 z-40');

export function Navbar() {
  return (
    <div className={container()}>
      <Link href="/">
        <Logo />
      </Link>
      <NavigationMenu />
      <AccessControls />
    </div>
  );
}
