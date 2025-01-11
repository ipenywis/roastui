import { roastModel } from './ai';
import { generateObject, streamObject } from 'ai';
import { IMPROVEMENTS_PROMPTS, NEW_DESIGN_PROMPTS } from './prompt';
import { DesignImprovements } from '@/types/designImprovements';
import { NewDesign } from '@/types/newDesign';
import { CoreMessage } from 'ai';
import { RoastedDesigns } from '@prisma/client';
import { AsyncStream } from './asyncStream';
import { StreamableRoastedDesign } from '@/types/roastedDesign';
import { parsePartialJson } from '@ai-sdk/ui-utils';
import { waitFor } from './time';

export async function getDesignImprovements(
  imageBase64: string,
): Promise<DesignImprovements> {
  const params = {
    model: roastModel,
    schema: IMPROVEMENTS_PROMPTS.schema,
    messages: [
      {
        role: 'system' as const,
        content: IMPROVEMENTS_PROMPTS.system,
      },
      {
        role: 'user' as const,
        content: [
          { type: 'text' as const, text: IMPROVEMENTS_PROMPTS.user },
          {
            type: 'image' as const,
            image: imageBase64,
          },
        ],
      },
    ] as CoreMessage[],
  };

  const result = await generateObject(params);
  return result.object as DesignImprovements;
}

export function getDesignImprovementsStreaming(
  designName: string,
  imageBase64: string,
  asyncStream: AsyncStream<StreamableRoastedDesign>,
) {
  const params = {
    model: roastModel,
    schema: IMPROVEMENTS_PROMPTS.schema,
    type: 'object',
    messages: [
      {
        role: 'system' as const,
        content: IMPROVEMENTS_PROMPTS.system,
      },
      {
        role: 'user' as const,
        content: [
          { type: 'text' as const, text: IMPROVEMENTS_PROMPTS.user },
          {
            type: 'image' as const,
            image: imageBase64,
          },
        ],
      },
    ] as CoreMessage[],
  };

  (async () => {
    const streamResult = await streamObject(params);
    let lastChunk: StreamableRoastedDesign | null = null;

    for await (const chunk of streamResult.partialObjectStream) {
      const streamableRoastedDesign: StreamableRoastedDesign = {
        name: designName,
        improvements: JSON.stringify(chunk.improvements),
        whatsWrong: JSON.stringify(chunk.whatsWrong),
        chunkType: 'IMPROVEMENTS',
        chunkStatus: 'PROCESSING',
      };
      lastChunk = streamableRoastedDesign;
      asyncStream.enqueue(streamableRoastedDesign);
    }

    asyncStream.enqueue({
      ...lastChunk,
      chunkType: 'IMPROVEMENTS',
      chunkStatus: 'COMPLETED',
    });
  })();
}

export async function getNewDesign(
  base64Image: string,
  improvements: DesignImprovements['improvements'],
): Promise<NewDesign> {
  const result = await generateObject({
    model: roastModel,
    schema: NEW_DESIGN_PROMPTS.schema,
    messages: [
      {
        role: 'system',
        content: NEW_DESIGN_PROMPTS.system,
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: NEW_DESIGN_PROMPTS.getUserPrompt(
              improvements.map((i) => `${i.category}: ${i.description}`),
            ),
          },
          {
            type: 'image',
            image: base64Image,
          },
        ],
      },
    ],
  });

  return result.object;
}

export function getNewDesignStreaming(
  base64Image: string,
  asyncStream: AsyncStream<StreamableRoastedDesign>,
) {
  (async () => {
    try {
      // Store the improvements data separately
      let improvements: DesignImprovements['improvements'] | null = null;
      let whatsWrong: DesignImprovements['whatsWrong'] | null = null;

      // Create a separate reader stream
      const readerStream = asyncStream.getStream();
      if (!readerStream) {
        //eslint-disable-next-line no-console
        console.error('Failed to get stream');
        return;
      }

      // Read from the stream first
      const reader = readerStream.getReader();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          if (value) {
            const { value: parsedValue } = parsePartialJson(value);
            const currentObject = parsedValue as StreamableRoastedDesign;
            if (
              currentObject &&
              currentObject.chunkType === 'IMPROVEMENTS' &&
              currentObject.chunkStatus === 'COMPLETED'
            ) {
              const { value: parsedImprovements } = parsePartialJson(
                currentObject.improvements,
              );
              const { value: parsedWhatsWrong } = parsePartialJson(
                currentObject.whatsWrong,
              );
              improvements =
                parsedImprovements as DesignImprovements['improvements'];
              whatsWrong = parsedWhatsWrong as DesignImprovements['whatsWrong'];
              break;
            }
          }
        }
      } finally {
        reader.releaseLock();
      }

      if (!improvements) {
        //eslint-disable-next-line no-console
        console.error('No improvements found');
        return;
      }

      // Now create a new stream for writing the results
      const result = streamObject({
        model: roastModel,
        schema: NEW_DESIGN_PROMPTS.schema,
        messages: [
          {
            role: 'system',
            content: NEW_DESIGN_PROMPTS.system,
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: NEW_DESIGN_PROMPTS.getUserPrompt(
                  improvements?.map((i) => `${i.category}: ${i.description}`),
                ),
              },
              {
                type: 'image',
                image: base64Image,
              },
            ],
          },
        ],
      });

      let lastChunk: StreamableRoastedDesign | null = null;

      // Write to a new stream
      for await (const chunk of result.partialObjectStream) {
        const streamableRoastedDesign: StreamableRoastedDesign = {
          improvements: JSON.stringify(improvements),
          whatsWrong: JSON.stringify(whatsWrong),
          improvedHtml: chunk.html,
          internalImprovedHtml: chunk.html,
          improvedReact: chunk.react,
          dataElements: chunk.dataElements,
          chunkType: 'NEW_DESIGN',
          chunkStatus: 'PROCESSING',
        };

        lastChunk = streamableRoastedDesign;
        asyncStream.enqueue(streamableRoastedDesign);
      }

      if (lastChunk) {
        asyncStream.enqueue({
          ...lastChunk,
          chunkType: 'NEW_DESIGN',
          chunkStatus: 'COMPLETED',
        });
      }
    } catch (error) {
      //TODO: Add proper error handling
    }
  })();
}

export function getPartialRoastedDesignStreaming(
  // newDesignStreamableValue: StreamableValue<Partial<NewDesign>>,
  newDesignReadableStream: ReadableStream<Partial<NewDesign>>,
  designImprovements: DesignImprovements,
): ReadableStream<string> {
  // const resultStream = createStreamableValue<Partial<RoastedDesigns>>();

  let accumulatedImprovedHtml = '';
  let accumulatedInternalImprovedHtml = '';
  let accumulatedImprovedReact = '';

  const roastedDesignStream = new ReadableStream<string>({
    async start(controller) {
      const reader = newDesignReadableStream.getReader();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          if (value?.html) accumulatedImprovedHtml += value?.html;
          if (value?.html) accumulatedInternalImprovedHtml += value?.html;
          if (value?.react) accumulatedImprovedReact += value?.react;

          const partialRoastedDesign: Partial<RoastedDesigns> = {
            improvements: JSON.stringify(designImprovements.improvements),
            whatsWrong: JSON.stringify(designImprovements.whatsWrong),
            improvedHtml: value?.html?.trim() === '' ? undefined : value?.html,
            internalImprovedHtml:
              value?.html?.trim() === '' ? undefined : value?.html,
            improvedReact:
              value?.react?.trim() === '' ? undefined : value?.react,
          };

          const stringifiedPartialRoastedDesign =
            JSON.stringify(partialRoastedDesign);

          controller.enqueue(stringifiedPartialRoastedDesign);
        }
      } catch (error) {
        controller.error(error);
      } finally {
        controller.close();
      }
    },
  });

  return roastedDesignStream;
}

export function createManagedRoastedDesignStream(
  asyncStream: AsyncStream<StreamableRoastedDesign>,
  options?: {
    onComplete?: (
      lastChunk: StreamableRoastedDesign,
    ) => Promise<RoastedDesigns>;
    onError?: (error: Error) => void;
  },
): ReadableStream<string> {
  let heartbeatInterval: NodeJS.Timeout;

  const { readable, writable } = new TransformStream<string, string>({
    start(controller) {
      // Setup heartbeat interval
      heartbeatInterval = setInterval(() => {
        try {
          controller.enqueue(JSON.stringify({ type: 'heartbeat' }));
        } catch (error) {
          clearInterval(heartbeatInterval);
        }
      }, 2000);
    },
    async transform(chunk: string, controller) {
      try {
        const { value: parsedChunk } = parsePartialJson(chunk);

        const currentParsedChunk = parsedChunk as StreamableRoastedDesign;

        // Enqueue the current chunk
        controller.enqueue(chunk);

        if (
          currentParsedChunk?.chunkType === 'ROASTED_DESIGN' &&
          currentParsedChunk.chunkStatus === 'COMPLETED'
        ) {
          controller.terminate();
        }

        if (
          currentParsedChunk?.chunkType === 'NEW_DESIGN' &&
          currentParsedChunk.chunkStatus === 'COMPLETED'
        ) {
          // Check if this is the final chunk (NEW_DESIGN with COMPLETED status)
          const roastedDesign = await options?.onComplete?.(currentParsedChunk);
          asyncStream.enqueue({
            ...roastedDesign,
            chunkType: 'ROASTED_DESIGN',
            chunkStatus: 'COMPLETED',
          });
        }
      } catch (error) {
        //eslint-disable-next-line no-console
        console.error('Error processing stream chunk:', error);
        controller.enqueue(chunk); // Pass through if parsing fails
        options?.onError?.(error as Error);
      }
    },
    flush() {
      clearInterval(heartbeatInterval);
    },
  });

  // Pipe the async stream to our managed transform stream
  const stream = asyncStream.getStream();
  if (!stream) {
    throw new Error('Failed to create stream');
  }

  stream.pipeTo(writable).catch((error) => {
    //eslint-disable-next-line no-console
    console.error('Stream processing error:', error);
  });

  return readable;
}
