'use client';

import { RiMenuLine } from 'react-icons/ri';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import appConfig from '@/config/app';
import Link from 'next/link';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../ui/collapsible';
import { handleLogout } from '@/lib/actions/auth';
import { cva } from 'class-variance-authority';

const menuItemTitle = cva('text-lg font-semibold');

const menuItemContainer = cva(
  'text-slate-300 hover:text-slate-100 transition-all duration-150 font-normal text-lg',
);

export function MobileMenu() {
  const isMobile = !useBreakpoint('lg');

  if (!isMobile) {
    return null;
  }

  return (
    <Sheet>
      <SheetTrigger>
        <RiMenuLine className="size-6" />
      </SheetTrigger>
      <SheetContent className="z-50 bg-black" side="right">
        <div className="flex flex-col gap-4">
          <Collapsible>
            <CollapsibleTrigger className={menuItemTitle()}>
              Menu
            </CollapsibleTrigger>
            <CollapsibleContent>
              <ul className="flex flex-col gap-y-2">
                {appConfig.navigationMenu.map((menuItem, idx) => (
                  <Link
                    className={menuItemContainer()}
                    href={menuItem.url}
                    key={idx}
                  >
                    {menuItem.item}
                  </Link>
                ))}
              </ul>
            </CollapsibleContent>
          </Collapsible>
          <Collapsible>
            <CollapsibleTrigger className={menuItemTitle()}>
              Account
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="flex flex-col gap-2">
                <Link
                  href="/playground"
                  prefetch
                  className={menuItemContainer()}
                >
                  New Roast ⚡️
                </Link>
                <Link
                  href="/dashboard"
                  prefetch
                  className={menuItemContainer()}
                >
                  Dashboard
                </Link>
                <Link href="/billing" prefetch className={menuItemContainer()}>
                  Billing
                </Link>
                <form action={handleLogout}>
                  <button className="w-full cursor-pointer">Logout</button>
                </form>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </SheetContent>
    </Sheet>
  );
}
