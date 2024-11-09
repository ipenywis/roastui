import { compressImage, MAX_IMAGE_UPLOAD_SIZE } from '@/lib/image';
import { getDesignImprovements, getNewDesign } from '@/lib/roast';
import imageService from '@/services/imageService';
import { RoastResponse } from '@/types/roastResponse';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export const POST = auth(async (request) => {
  const { auth } = request;

  if (!auth || !auth.user || !auth.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const name = formData.get('name');
    const image = formData.get('image');

    if (!name || !image) {
      return NextResponse.json(
        { error: 'Name and image are required' },
        { status: 400 }
      );
    }

    if (!(image instanceof File)) {
      return NextResponse.json(
        { error: 'Invalid image file' },
        { status: 400 }
      );
    }

    if (image.size > MAX_IMAGE_UPLOAD_SIZE) {
      return NextResponse.json(
        { error: 'Image size exceeds 5MB' },
        { status: 400 }
      );
    }

    const compressedImage = await compressImage(image);

    const improvements = await getDesignImprovements(compressedImage);

    const newDesign = await getNewDesign(
      compressedImage,
      improvements.improvements
    );

    console.log(newDesign.react);

    const originalImageUrl = await imageService.uploadImage(
      auth?.user,
      compressedImage
    );

    const newRoastedDesign = await prisma.roastedDesigns.create({
      data: {
        name: name.toString(),
        userId: auth.user.id,
        originalImageUrl,
        improvedHtml: newDesign.html,
        improvedReact: newDesign.react,
        improvements: JSON.stringify(improvements.improvements),
        whatsWrong: JSON.stringify(improvements.whatsWrong),
      },
    });

    return NextResponse.json(newRoastedDesign);
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to process upload' },
      { status: 500 }
    );
  }
});
