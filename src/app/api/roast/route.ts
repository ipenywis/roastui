import {
  compressImage,
  getImageBase64,
  MAX_IMAGE_UPLOAD_SIZE,
} from '@/lib/image';
import { getDesignImprovements, getNewDesign } from '@/lib/roast';
import imageService from '@/services/imageService';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import {
  preprocessUiHtml,
  preprocessUiHtmlInternal,
} from '@/lib/preprocessing/uiHtml';
import { DesignImprovements } from '@/types/designImprovements';

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
        { status: 400 },
      );
    }

    if (!(image instanceof File)) {
      return NextResponse.json(
        { error: 'Invalid image file' },
        { status: 400 },
      );
    }

    if (image.size > MAX_IMAGE_UPLOAD_SIZE) {
      return NextResponse.json(
        { error: 'Image size exceeds 5MB' },
        { status: 400 },
      );
    }

    const compressedImage = await compressImage(image);

    const base64Image = await getImageBase64(compressedImage);

    const improvements = (await getDesignImprovements(
      base64Image,
    )) as DesignImprovements;

    const newDesign = await getNewDesign(
      base64Image,
      improvements.improvements,
    );

    const preprocessedImprovedHtml = preprocessUiHtml(newDesign.html);
    const preprocessedInternalImprovedHtml = preprocessUiHtmlInternal(
      newDesign.html,
    );

    const originalImageUrl = await imageService.uploadImage(
      auth?.user,
      compressedImage,
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
        internalImprovedHtml: preprocessedInternalImprovedHtml,
        improvedReact: newDesign.react,
        improvements: JSON.stringify(improvements.improvements),
        whatsWrong: JSON.stringify(improvements.whatsWrong),
        uiHighlights: JSON.stringify(uiHighlights),
      },
    });

    return NextResponse.json(newRoastedDesign);
  } catch (error) {
    //TODO: Handle errors properly - Prob add logging
    //eslint-disable-next-line no-console
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to process upload' },
      { status: 500 },
    );
  }
});
