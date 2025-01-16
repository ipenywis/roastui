import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-col w-full min-h-full h-full">
      <Navbar />
      {children}
      <Footer />
    </main>
  );
}
