import { Navbar } from '@/components/navbar';

export default function PlaygroundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-col size-full">
      <Navbar />
      <div className="flex flex-col size-full pt-12">{children}</div>
    </main>
  );
}
