import { ImproveUIDesign } from '@/components/ImproveUIDesign';
import { Faq } from '@/components/faq';
import { Footer } from '@/components/footer';
import { GoodVsBadUI } from '@/components/goodVsBadUI';
import { Hero } from '@/components/hero';
import { HomePagePricing } from '@/components/homePagePricing';
import { PageMainContainer } from '@/components/pageMainContainer';
import { Suspense } from 'react';

export const revalidate = 86400;

// export const dynamic = 'force-static';

export default function Home() {
  // return <PageMainContainer>Hey</PageMainContainer>;

  return (
    <PageMainContainer>
      {/* hey */}
      <Hero />
      {/* <div className="flex flex-col items-center w-full">
        <GoodVsBadUI />
        <ImproveUIDesign />
        <Suspense fallback={<div>Loading...</div>}>
          <HomePagePricing />
        </Suspense>
        <Faq />
      </div> */}
      {/* <Footer /> */}
    </PageMainContainer>
  );
}
