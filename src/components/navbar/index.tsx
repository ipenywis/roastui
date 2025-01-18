'use client';

import { cva } from 'class-variance-authority';
import { Logo } from '../logo';
import { NavigationMenu } from './navigationMenu';
import Link from 'next/link';
import { MobileMenu } from './mobileMenu';
import { useBreakpoint } from '@/hooks/useBreakpoint';

const container = cva(
  'flex justify-between lg:justify-around items-center px-4 lg:px-8 py-6 z-40',
);

function Menu() {
  const isDesktop = useBreakpoint('lg', true);

  if (isDesktop) {
    return <NavigationMenu />;
  }

  return <MobileMenu />;
}

export function Navbar() {
  return (
    <div className={container()}>
      <Link href="/">
        <Logo />
      </Link>
      <Menu />
    </div>
  );
}
