import { Navbar } from '@/components/navbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-col size-full">
      <Navbar />
      {children}
    </main>
  );
}
