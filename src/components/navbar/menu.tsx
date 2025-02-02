'use client';

import { useBreakpoint } from '@/hooks/useBreakpoint';
import { MobileMenu } from './mobileMenu';
import { NavigationMenu } from './navigationMenu';

export function Menu() {
  const isDesktop = useBreakpoint('lg', true);

  if (isDesktop) {
    return <NavigationMenu />;
  }

  return <MobileMenu />;
}
