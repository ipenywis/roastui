import { Faq } from '@/components/faq';
import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';
import {
  PageMainContainer,
  PageMainContainerInner,
} from '@/components/pageMainContainer';

export default function FaqPage() {
  return (
    <PageMainContainer>
      <Navbar />
      <PageMainContainerInner className="h-auto">
        <div className="flex flex-col items-center w-full mt-20">
          <Faq className="mb-10 lg:mb-14" />
        </div>
      </PageMainContainerInner>
      <Footer />
    </PageMainContainer>
  );
}
