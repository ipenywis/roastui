import { Navbar } from '@/components/navbar';

export default function SubscribeLayout({
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
