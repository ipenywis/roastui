import { RiAddLine } from 'react-icons/ri';
import { Button } from '../ui/button';
import { cva } from 'class-variance-authority';
import { DesignCard } from '@/components/ui/designCard';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

const container = cva('flex flex-col gap-10 w-full max-w-screen-md');

const headerText = cva('text-xl font-bold');

const header = cva('flex items-center gap-3 justify-between');

const gridContainer = cva('grid grid-cols-3 gap-x-3 gap-y-6');

export async function UserSavedDesigns() {
  const session = await auth();
  const designs = await prisma.roastedDesigns.findMany({
    where: {
      userId: session?.user?.id,
    },
  });

  return (
    <div className={container()}>
      <div className={header()}>
        <span className={headerText()}>Your Designs</span>
        <Link href="/playground">
          <Button size="sm">
            New
            <RiAddLine className="ml-2" />
          </Button>
        </Link>
      </div>
      <div className={gridContainer()}>
        {designs.map((design) => (
          <DesignCard
            key={design.id}
            id={design.id}
            thumbnailUrl={design.originalImageUrl}
            name={design.name}
          />
        ))}
      </div>
    </div>
  );
}
