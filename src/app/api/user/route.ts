import { auth } from '@/auth';
import { makeStandardApiResponse } from '@/lib/apiResponse';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const GET = async () => {
  const session = await auth();

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findFirst({
    where: {
      id: session.user.id,
    },
    include: {
      subscription: true,
    },
  });

  return NextResponse.json(makeStandardApiResponse({ user }));
};
