import { compressImage, MAX_IMAGE_UPLOAD_SIZE } from '@/lib/image';
import { getDesignImprovements, getNewDesign } from '@/lib/roast';
import imageService from '@/services/imageService';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { preprocessUiHtml } from '@/lib/preprocessing/uiHtml';

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

    const preprocessedImprovedHtml = preprocessUiHtml(newDesign.html);

    const originalImageUrl = await imageService.uploadImage(
      auth?.user,
      compressedImage
    );

    const uiHighlights = {
      improvements: newDesign.dataElements?.map((element) => {
        return {
          improvement: element.improvement,
          element: element.element,
        };
      }),
      //TODO: Add what's wrong data elements here same as improvements
    };

    const newRoastedDesign = await prisma.roastedDesigns.create({
      data: {
        name: name.toString(),
        userId: auth.user.id,
        originalImageUrl,
        improvedHtml: preprocessedImprovedHtml,
        improvedReact: newDesign.react,
        improvements: JSON.stringify(improvements.improvements),
        whatsWrong: JSON.stringify(improvements.whatsWrong),
        uiHighlights: JSON.stringify(uiHighlights),
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
