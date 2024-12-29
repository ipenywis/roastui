import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';
import { DesignPreviewStoreProvider } from '@/lib/providers/designPreviewStoreProvider';

export default function PlaygroundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-col size-full relative">
      <Navbar />
      <DesignPreviewStoreProvider>
        <div className="flex flex-col pt-12 grow">{children}</div>
      </DesignPreviewStoreProvider>
      <Footer />
    </main>
  );
}
