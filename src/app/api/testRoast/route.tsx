import { roastModel } from '@/lib/ai';
import { getImageBase64 } from '@/lib/image';
import { anthropic } from '@ai-sdk/anthropic';
import { generateObject, generateText } from 'ai';
import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { z } from 'zod';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const image = formData.get('image');

  if (!image) {
    return NextResponse.json({ error: 'No image provided' }, { status: 400 });
  }

  const imageBase64 = await getImageBase64(image as File);

  const buffer = Buffer.from(imageBase64.split(',')[1], 'base64');
  const metadata = await sharp(buffer).metadata();

  console.log('Metadata: ', metadata);

  if (!metadata.width || !metadata.height) {
    return NextResponse.json({ error: 'Invalid image' }, { status: 400 });
  }

  const computerTool = anthropic.tools.computer_20241022({
    displayWidthPx: metadata.width,
    displayHeightPx: metadata.height,
    execute: async ({ action, coordinate, text }) => {
      console.log('Action: ', action);
      console.log('Coordinate: ', coordinate);
      console.log('Text: ', text);
    },
  });

  // const response = await generateObject({
  //   model: roastModel,
  //   schema: z.object({
  //     originalImageDimensions: z.object({
  //       width: z.number(),
  //       height: z.number(),
  //     }),
  //     uiElements: z.array(
  //       z.object({
  //         name: z.string(),
  //         coordinates: z.object({
  //           x: z.number(),
  //           y: z.number(),
  //           width: z.number(),
  //           height: z.number(),
  //         }),
  //       })
  //     ),
  //   }),
  //   messages: [
  //     {
  //       role: 'system',
  //       content:
  //         'You are an expert UI/UX designer. We are going to provide you with a design image and tell us some info about the design. Please provide the following: 1. Name of the element that needs improvements. 2. Exact x, y, width and height coordinates of the different UI elements on the image. Make sure the coordinates are exact and not approximate so we can use them to highlight the elements.',
  //     },
  //     {
  //       role: 'user',
  //       content: [
  //         {
  //           type: 'text',
  //           text: 'Please provide the following: 1. Name of the element that needs improvements. 2. Exact x, y, width and height coordinates of the different UI elements on the image. Make sure the coordinates are exact and not approximate so we can use them to highlight the elements.',
  //         },
  //         {
  //           type: 'image',
  //           image: imageBase64,
  //         },
  //       ],
  //     },
  //   ],
  // });

  const responseWithTools = await generateText({
    model: roastModel,
    messages: [
      {
        role: 'system',
        content:
          'You are an expert UI/UX designer. We are going to provide you with a design image and tell us some info about the design. Please provide the following: 1. Name of the element that needs improvements. 2. Exact x, y, width and height coordinates of the different UI elements on the image. Make sure the coordinates are exact and not approximate so we can use them to highlight the elements.',
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Please provide the following: 1. Name of the element that needs improvements. 2. Exact x, y, width and height coordinates of the different UI elements on the image. Make sure the coordinates are exact and not approximate so we can use them to highlight the elements.',
          },
          {
            type: 'image',
            image: imageBase64,
          },
        ],
      },
    ],
    tools: { computer: computerTool },
  });

  console.log('Response: ', responseWithTools.text);

  return NextResponse.json(responseWithTools.text);
}
