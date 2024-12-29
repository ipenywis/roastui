import {
  compressImage,
  getImageBase64,
  MAX_IMAGE_UPLOAD_SIZE,
} from '@/lib/image';
import {
  createManagedRoastedDesignStream,
  getDesignImprovementsStreaming,
  getNewDesignStreaming,
} from '@/lib/roast';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import {
  preprocessUiHtml,
  preprocessUiHtmlInternal,
} from '@/lib/preprocessing/uiHtml';
import { AsyncStream } from '@/lib/asyncStream';
import { StreamableRoastedDesign } from '@/types/roastedDesign';
import { isValidAndNotEmptyString } from '@/lib/string';
import { isValidAndNotEmptyArray } from '@/lib/array';
import { RoastedDesigns } from '@prisma/client';
import { getStreamingHeaders } from '@/lib/headers';
import { preprocessUiReact } from '@/lib/preprocessing/uiReact';

async function processRoastedDesign(params: {
  name: string | null;
  image: File;
  userId: string;
  existingDesign?: RoastedDesigns;
  id?: string;
}) {
  const { name, image, userId, existingDesign, id } = params;

  if (image.size > MAX_IMAGE_UPLOAD_SIZE) {
    throw new Error('Image size exceeds 5MB');
  }

  const compressedImage = await compressImage(image);
  const base64Image = await getImageBase64(compressedImage);

  const asyncStream = new AsyncStream<StreamableRoastedDesign>();

  getDesignImprovementsStreaming(
    name?.toString() || existingDesign?.name || '',
    base64Image,
    asyncStream,
  );
  getNewDesignStreaming(base64Image, asyncStream);

  const handleComplete = async (
    streamableRoastedDesign: StreamableRoastedDesign,
  ): Promise<RoastedDesigns> => {
    if (
      !streamableRoastedDesign ||
      !isValidAndNotEmptyString(
        streamableRoastedDesign?.internalImprovedHtml,
      ) ||
      !isValidAndNotEmptyString(streamableRoastedDesign?.improvedHtml) ||
      !isValidAndNotEmptyString(streamableRoastedDesign?.improvements) ||
      !isValidAndNotEmptyString(streamableRoastedDesign?.whatsWrong) ||
      !isValidAndNotEmptyString(streamableRoastedDesign?.improvedReact) ||
      !isValidAndNotEmptyArray(streamableRoastedDesign?.dataElements)
    ) {
      throw new Error('RoastedDesign is not valid');
    }

    const data = {
      name: name?.toString() || existingDesign?.name || '',
      userId,
      originalImageUrl: base64Image,
      improvedHtml: preprocessUiHtml(streamableRoastedDesign.improvedHtml!),
      internalImprovedHtml: preprocessUiHtmlInternal(
        streamableRoastedDesign.internalImprovedHtml!,
      ),
      improvedReact: preprocessUiReact(streamableRoastedDesign.improvedReact!),
      internalImprovedReact: streamableRoastedDesign.improvedReact!,
      improvements: streamableRoastedDesign.improvements!,
      whatsWrong: streamableRoastedDesign.whatsWrong!,
      uiHighlights: JSON.stringify({
        improvements: streamableRoastedDesign?.dataElements?.map((element) => ({
          improvement: element?.improvement,
          element: element?.element,
        })),
      }),
    };

    if (id) {
      return prisma.roastedDesigns.update({
        where: { id },
        data,
      });
    }

    return prisma.roastedDesigns.create({ data });
  };

  const handleError = (error: Error) => {
    //TODO: Handle errors properly - Prob add logging
    // eslint-disable-next-line no-console
    console.error('Error:', error);
  };

  return createManagedRoastedDesignStream(asyncStream, {
    onComplete: handleComplete,
    onError: handleError,
  });
}

export const POST = auth(async (request) => {
  const { auth } = request;

  if (!auth?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const name = formData.get('name');
    const image = formData.get('image');

    if (!name || !image || !(image instanceof File)) {
      return NextResponse.json(
        { error: 'Valid name and image are required' },
        { status: 400 },
      );
    }

    const roastedDesignStream = await processRoastedDesign({
      name: name.toString(),
      image,
      userId: auth.user.id,
    });

    return new Response(roastedDesignStream, {
      headers: getStreamingHeaders(),
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process upload' },
      { status: 500 },
    );
  }
});

export const PUT = auth(async (request) => {
  const { auth } = request;

  if (!auth?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const name = formData.get('name');
    const image = formData.get('image');
    const id = formData.get('id');

    if (!id || !image || !(image instanceof File)) {
      return NextResponse.json(
        { error: 'Valid id and image are required' },
        { status: 400 },
      );
    }

    const existingDesign = await prisma.roastedDesigns.findUnique({
      where: { id: id.toString() },
    });

    if (!existingDesign) {
      return NextResponse.json(
        { error: 'Roasted design with provided id not found' },
        { status: 404 },
      );
    }

    const roastedDesignStream = await processRoastedDesign({
      name: name?.toString() || null,
      image,
      userId: auth.user.id,
      existingDesign,
      id: id.toString(),
    });

    return new Response(roastedDesignStream, {
      headers: getStreamingHeaders(),
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process upload' },
      { status: 500 },
    );
  }
});
