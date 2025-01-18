import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { handleLogout } from '@/lib/actions/auth';
import { useSession } from 'next-auth/react';

export function UserMenu() {
  // const session = await auth();
  const { data: session } = useSession();

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
          <DropdownMenuItem>New Roast ⚡️</DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <Link href="/dashboard" prefetch>
          <DropdownMenuItem>Dashboard</DropdownMenuItem>
        </Link>
        <Link href="/billing" prefetch>
          <DropdownMenuItem>Billing</DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <form action={handleLogout}>
          <button className="w-full cursor-pointer">
            <DropdownMenuItem className="text-red-500">Logout</DropdownMenuItem>
          </button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
