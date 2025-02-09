import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import imageService from '@/services/imageService';

export async function DELETE(
  // @ts-ignore
  request: NextRequest,
  { params }: { params: { designId: string } },
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get the design first to check ownership and get the image URL
    const design = await prisma.roastedDesigns.findUnique({
      where: {
        id: params.designId,
      },
    });

    if (!design) {
      return NextResponse.json({ error: 'Design not found' }, { status: 404 });
    }

    // Check if the user owns the design
    if (design.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Delete the image from storage
    if (design.originalImageUrl) {
      await imageService.deleteImage(design.originalImageUrl);
    }

    // Delete the design from the database
    await prisma.roastedDesigns.delete({
      where: {
        id: params.designId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    // Log error to error monitoring service in production
    return NextResponse.json(
      { error: 'Failed to delete design' },
      { status: 500 },
    );
  }
}
