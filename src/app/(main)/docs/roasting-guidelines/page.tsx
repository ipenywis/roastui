'use client';

import { StandardNavbar } from '@/components/standardNavbar';
import { Footer } from '@/components/footer';
import Content from './content.mdx';
import { cn } from '@/lib/utils';
import { customProse } from '@/lib/markdownProse';

export default function RoastingGuidelines() {
  return (
    <div className="min-h-screen flex flex-col">
      <StandardNavbar />
      <main className="flex-grow container flex flex-col items-center px-4 py-8 mt-12">
        <div className={cn(customProse, 'w-full max-w-screen-md')}>
          <Content />
        </div>
      </main>
      <Footer />
    </div>
  );
}
