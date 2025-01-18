'use client';

import { RiMenuLine } from 'react-icons/ri';
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '../ui/sheet';
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
import { Button } from '../ui/button';
import { useSession } from 'next-auth/react';
import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';

const collapsibleContainer = cva(
  'text-start px-5 text-lg font-semibold border-b border-t w-full py-3 border-gray-800',
);

const menuItemTitle = cva('text-start text-lg font-semibold w-full');

const menuItemContainer = cva(
  'text-slate-300 hover:text-slate-100 transition-all duration-150 font-normal text-lg',
);

const collapsibleContent = cva(
  'flex flex-col gap-y-4 [&[data-state="open"]]:mt-4',
);

function AuthCollapsible() {
  return (
    <Collapsible className={collapsibleContainer()} defaultOpen>
      <CollapsibleTrigger className={menuItemTitle()}>
        Account
      </CollapsibleTrigger>
      <CollapsibleContent className={collapsibleContent()}>
        <div className="flex gap-3">
          <SheetClose asChild>
            <Link href="/login">
              <Button variant="secondary">Login</Button>
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link href="/signup">
              <Button variant="default">Signup</Button>
            </Link>
          </SheetClose>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export function MobileMenu() {
  const isMobile = !useBreakpoint('lg');

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const router = useRouter();

  const { status } = useSession();

  const preventAutoFocusOnClose = useCallback((e: Event) => {
    return e.preventDefault();
  }, []);

  const onLinkClick = useCallback(
    (link: string) => {
      router.push(link);
      setIsDrawerOpen(false);
    },
    [router, setIsDrawerOpen],
  );

  if (!isMobile) {
    return null;
  }

  return (
    <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen} modal={false}>
      <SheetTrigger>
        <RiMenuLine className="size-6" />
      </SheetTrigger>
      <SheetContent
        className="z-50 px-0 pt-16 bg-primary-foreground"
        side="right"
        onCloseAutoFocus={preventAutoFocusOnClose}
        autoFocus={false}
      >
        <div className="flex flex-col gap-4">
          <Collapsible className={collapsibleContainer()} defaultOpen>
            <CollapsibleTrigger className={menuItemTitle()}>
              Menu
            </CollapsibleTrigger>
            <CollapsibleContent className={collapsibleContent()}>
              <ul className="flex flex-col gap-y-2">
                {appConfig.navigationMenu.map((menuItem, idx) => (
                  <span
                    className={menuItemContainer()}
                    key={idx}
                    onClick={() => onLinkClick(menuItem.url)}
                  >
                    {menuItem.item}
                  </span>
                ))}
              </ul>
            </CollapsibleContent>
          </Collapsible>
          {status === 'authenticated' && (
            <Collapsible className={collapsibleContainer()}>
              <CollapsibleTrigger className={menuItemTitle()}>
                Account
              </CollapsibleTrigger>
              <CollapsibleContent className={collapsibleContent()}>
                <div className="flex flex-col gap-2">
                  <Link
                    href="/playground"
                    prefetch
                    className={menuItemContainer()}
                  >
                    ⚡️ New Roast
                  </Link>
                  <Link
                    href="/dashboard"
                    prefetch
                    className={menuItemContainer()}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/billing"
                    prefetch
                    className={menuItemContainer()}
                  >
                    Billing
                  </Link>
                  <form action={handleLogout}>
                    <button
                      className={menuItemContainer({
                        className: 'text-red-600',
                      })}
                    >
                      Logout
                    </button>
                  </form>
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}
          {status === 'unauthenticated' && <AuthCollapsible />}
        </div>
      </SheetContent>
    </Sheet>
  );
}
