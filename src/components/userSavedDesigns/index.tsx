import { Button } from '../ui/button';
import { cva } from 'class-variance-authority';
import { DesignCard } from '@/components/ui/designCard';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export const container = cva(
  'flex h-full flex-col gap-10 w-full max-w-[920px] mb-4',
);

const headerText = cva('text-xl font-bold');

const header = cva('flex items-center gap-3 justify-around lg:justify-between');

const gridContainer = cva(
  'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-10 lg:gap-x-4 gap-y-12 mx-auto',
);

export async function UserSavedDesigns() {
  const session = await auth();
  const designs = await prisma.roastedDesigns.findMany({
    where: {
      userId: session?.user?.id,
    },
  });

  const sortedDesigns = designs.sort((a, b) => {
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  const noDesigns = sortedDesigns.length === 0;

  return (
    <div className={container()}>
      <div className={header()}>
        <span className={headerText()}>Your roasted designs</span>
        <Link href="/playground">
          <Button>
            New Roast
            <span className="ml-1">🔥</span>
          </Button>
        </Link>
      </div>
      {noDesigns && (
        <div className="flex h-full flex-col items-center justify-center w-full">
          <div className="flex flex-col items-center justify-center w-full">
            <span className="text-base text-gray-400">
              You have no designs created yet
            </span>
          </div>
        </div>
      )}
      {!noDesigns && (
        <div className={gridContainer()}>
          {sortedDesigns.map((design) => (
            <DesignCard
              key={design.id}
              id={design.id}
              thumbnailUrl={design.originalImageUrl}
              name={design.name}
              updatedAt={design.updatedAt}
            />
          ))}
        </div>
      )}
    </div>
  );
}
