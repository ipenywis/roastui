import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { signOut, useSession } from 'next-auth/react';
import { useCallback, useState } from 'react';
import { RiLoader3Fill } from 'react-icons/ri';

export function UserMenu() {
  const { data: session } = useSession();
  const [isLoggingOut, setIsLogginOut] = useState(false);

  const handleLogout = useCallback(async () => {
    setIsLogginOut(true);
    await signOut({ redirectTo: '/' });
    setIsLogginOut(false);
  }, [setIsLogginOut]);

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger>
        <Avatar className="outline-none">
          <AvatarImage src={session?.user?.image || undefined} />
          <AvatarFallback>
            {session?.user?.name?.slice(0, 2).toUpperCase() || ''}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <Link href="/playground" prefetch>
          <DropdownMenuItem>New Roast 🔥</DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <Link href="/dashboard" prefetch>
          <DropdownMenuItem>Dashboard</DropdownMenuItem>
        </Link>
        <Link href="/billing" prefetch>
          <DropdownMenuItem>Billing</DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <button className="w-full cursor-pointer" onClick={handleLogout}>
          <DropdownMenuItem className="text-red-500">
            Logout
            {isLoggingOut && <RiLoader3Fill className="animate-spin size-4" />}
          </DropdownMenuItem>
        </button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
