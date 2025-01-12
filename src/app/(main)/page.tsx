import { ImproveUIDesign } from '@/components/ImproveUIDesign';
import { Faq } from '@/components/faq';
import { Footer } from '@/components/footer';
import { GoodVsBadUI } from '@/components/goodVsBadUI';
import { Hero } from '@/components/hero';
import { HeroShow } from '@/components/heroShow';
import { HomePagePricing } from '@/components/homePagePricing';
import { Suspense } from 'react';

export const revalidate = 86400;

// export const dynamic = 'force-static';

export default function Home() {
  return (
    <main className="flex flex-col">
      <Hero />
      {/* <HeroShow /> */}
      <div className="flex flex-col items-center w-full">
        <GoodVsBadUI />
        <ImproveUIDesign />
        <Suspense fallback={<div>Loading...</div>}>
          <HomePagePricing />
        </Suspense>
        <Faq />
      </div>
      <Footer />
    </main>
  );
}
