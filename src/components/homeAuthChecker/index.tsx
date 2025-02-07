'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

export function HomeAuthChecker() {
  const router = useRouter();
  const { data: session, status } = useSession(); // or however you check auth status

  useEffect(() => {
    if (session?.user && status === 'authenticated') {
      router.replace('/dashboard');
    }
  }, [session, router, status]);

  return <></>;
}
