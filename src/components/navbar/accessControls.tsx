import { cva } from 'class-variance-authority';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { auth } from '@/auth';
import { UserMenu } from './userMenu';
import { useSession } from 'next-auth/react';

const buttonsContainer = cva(
  'flex gap-x-3 items-center focus-visible:outline-none outline-none focus-within:outline-none',
);

export function AccessControls() {
  // const session = await auth();
  const { data: session } = useSession();

  return (
    <div className={buttonsContainer()}>
      {!session && (
        <>
          <Link href="/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link href="/signup">
            <Button variant="default">Signup</Button>
          </Link>
        </>
      )}
      {session && <UserMenu />}
    </div>
  );
}
