import { auth } from '@/auth';
import { UserSavedDesigns } from '@/components/userSavedDesigns';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="flex flex-col items-center size-full py-20">
      <Suspense fallback={<div>Loading...</div>}>
        <UserSavedDesigns />
      </Suspense>
    </div>
  );
}
