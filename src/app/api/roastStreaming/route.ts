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
import imageService from '@/services/imageService';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import {
  preprocessUiHtml,
  preprocessUiHtmlInternal,
} from '@/lib/preprocessing/uiHtml';
import { DesignImprovements } from '@/types/designImprovements';
import {
  createDataStream,
  createDataStreamResponse,
  StreamObjectResult,
} from 'ai';
import { AsyncStream } from '@/lib/asyncStream';
import { StreamableRoastedDesign } from '@/types/roastedDesign';
import { isValidAndNotEmptyString } from '@/lib/string';
import { isValidAndNotEmptyArray } from '@/lib/array';
import { RoastedDesigns } from '@prisma/client';

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

    const asyncStream = new AsyncStream<StreamableRoastedDesign>();

    getDesignImprovementsStreaming(base64Image, asyncStream);
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

      const preprocessedInternalImprovedHtml = preprocessUiHtmlInternal(
        streamableRoastedDesign.internalImprovedHtml!,
      );

      const preprocessedImprovedHtml = preprocessUiHtml(
        streamableRoastedDesign.improvedHtml!,
      );

      const uiHighlights = {
        improvements: streamableRoastedDesign?.dataElements?.map((element) => {
          return {
            improvement: element?.improvement,
            element: element?.element,
          };
        }),
      };

      const roastedDesign = await prisma.roastedDesigns.create({
        data: {
          name: name.toString(),
          userId: auth?.user?.id!,
          originalImageUrl: base64Image,
          improvedHtml: preprocessedImprovedHtml,
          internalImprovedHtml: preprocessedInternalImprovedHtml,
          improvedReact: streamableRoastedDesign.improvedReact!,
          improvements: streamableRoastedDesign.improvements!,
          whatsWrong: streamableRoastedDesign.whatsWrong!,
          uiHighlights: JSON.stringify(uiHighlights),
        },
      });

      return roastedDesign;
    };

    const handleError = (error: Error) => {
      //TODO: Handle errors properly - Prob add logging
      //eslint-disable-next-line no-console
      console.error('Error:', error);
    };

    const roastedDesignStream = createManagedRoastedDesignStream(asyncStream, {
      onComplete: handleComplete,
      onError: handleError,
    });

    return new Response(roastedDesignStream);
  } catch (error) {
    //TODO: Handle errors properly - Prob add logging
    //eslint-disable-next-line no-console
    console.error('Processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process upload' },
      { status: 500 },
    );
  }
});
