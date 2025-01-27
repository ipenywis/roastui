import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';
import {
  PageMainContainer,
  PageMainContainerInner,
} from '@/components/pageMainContainer';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PageMainContainer className="flex flex-col w-full h-full">
      <Navbar />
      <PageMainContainerInner className="h-full">
        {children}
      </PageMainContainerInner>
      <Footer />
    </PageMainContainer>
  );
}
