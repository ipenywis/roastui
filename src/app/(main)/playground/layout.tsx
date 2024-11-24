import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';

export default function PlaygroundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-col size-full relative">
      <Navbar />
      <div className="flex flex-col pt-12 h-full">{children}</div>
      <Footer />
    </main>
  );
}
