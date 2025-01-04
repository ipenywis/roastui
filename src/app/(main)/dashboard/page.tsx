import { auth } from '@/auth';
import { UserSavedDesigns } from '@/components/userSavedDesigns';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="flex flex-col items-center w-full min-h-screen py-20">
      <UserSavedDesigns />
    </div>
  );
}
