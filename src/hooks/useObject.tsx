import {
  FetchFunction,
  isAbortError,
  safeValidateTypes,
} from '@ai-sdk/provider-utils';
import {
  asSchema,
  DeepPartial,
  isDeepEqualData,
  Schema,
} from '@ai-sdk/ui-utils';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import useSWR from 'swr';
import z from 'zod';
import { parse as parsePartial } from 'partial-json';

// use function to allow for mocking in tests:
const getOriginalFetch = (
  fetchFunction: FetchFunction | undefined,
  debugDelay?: [number, number],
) => {
  const originalFetch = fetchFunction ?? fetch;
  return async (input: RequestInfo | URL, init?: RequestInit) => {
    const response = await originalFetch(input, init);

    if (!response.body) return response;

    let transformedBody = response.body;

    // Split chunks randomly (for testing partial objects)
    // @ts-ignore
    const splitStream = new TransformStream({
      async transform(chunk, controller) {
        const text = new TextDecoder().decode(chunk);

        const chunkSize = Math.floor(text.length / 5);
        const part1 = text.slice(0, chunkSize);
        const part2 = text.slice(chunkSize, chunkSize * 2);
        const part3 = text.slice(chunkSize * 2, chunkSize * 3);
        const part4 = text.slice(chunkSize * 3, chunkSize * 4);
        const part5 = text.slice(chunkSize * 4);

        controller.enqueue(new TextEncoder().encode(part1));
        await new Promise((resolve) => setTimeout(resolve, 50));
        controller.enqueue(new TextEncoder().encode(part2));
        await new Promise((resolve) => setTimeout(resolve, 50));
        controller.enqueue(new TextEncoder().encode(part3));
        await new Promise((resolve) => setTimeout(resolve, 50));
        controller.enqueue(new TextEncoder().encode(part4));
        await new Promise((resolve) => setTimeout(resolve, 50));
        controller.enqueue(new TextEncoder().encode(part5));
      },
    });

    // transformedBody = transformedBody.pipeThrough(splitStream);

    // Apply debug delay if specified
    if (debugDelay) {
      const [min, max] = debugDelay;
      const delayStream = new TransformStream({
        async transform(chunk, controller) {
          await new Promise((resolve) =>
            setTimeout(resolve, Math.random() * (max - min) + min),
          );
          controller.enqueue(chunk);
        },
      });
      transformedBody = transformedBody.pipeThrough(delayStream);
    }

    return new Response(transformedBody, response);
  };
};

export type Experimental_UseObjectOptions<RESULT, HEARTBEAT> = {
  /**
   * The API endpoint. It should stream JSON that matches the schema as chunked text.
   */
  api: string;

  /**
   * A Zod schema that defines the shape of the complete object.
   */
  schema: z.Schema<RESULT, z.ZodTypeDef, any> | Schema<RESULT>;

  /**
   * An unique identifier. If not provided, a random one will be
   * generated. When provided, the `useObject` hook with the same `id` will
   * have shared states across components.
   */
  id?: string;

  /**
   * An optional value for the initial object.
   */
  initialValue?: DeepPartial<RESULT>;

  /**
Custom fetch implementation. You can use it as a middleware to intercept requests,
or to provide a custom fetch implementation for e.g. testing.
    */
  fetch?: FetchFunction;

  /**
Callback that is called when the stream has finished.
     */
  onFinish?: (event: {
    /**
The generated object (typed according to the schema).
Can be undefined if the final object does not match the schema.
   */
    object: RESULT | undefined;

    /**
Optional error object. This is e.g. a TypeValidationError when the final object does not match the schema.
 */
    error: Error | undefined;
  }) => Promise<void> | void;

  /**
   * Callback function to be called when an error is encountered.
   */
  onError?: (error: Error) => void;

  /**
   * Additional HTTP headers to be included in the request.
   */
  headers?: Record<string, string> | Headers;

  /**
   * Flag that indicates whether the current object is a heartbeat.
   */
  isHeartbeat?: (object: DeepPartial<HEARTBEAT>) => boolean;
  /**
   * Artificial delay range in milliseconds for simulating slow responses.
   * Provide [min, max] values for random delay between chunks.
   */
  debugDelay?: [number, number];
};

export type Experimental_UseObjectHelpers<RESULT, INPUT> = {
  /**
   * Calls the API with the provided input as JSON body.
   */
  submit: (input: INPUT) => void;

  /**
   * The current value for the generated object. Updated as the API streams JSON chunks.
   */
  object: DeepPartial<RESULT> | undefined;

  /**
   * The error object of the API request if any.
   */
  error: Error | undefined;

  /**
   * Flag that indicates whether an API request is in progress.
   */
  isLoading: boolean;

  /**
   * Abort the current request immediately, keep the current partial object if any.
   */
  stop: () => void;

  /**
   * Clear the current object and error.
   */
  clear: () => void;
};

export function useObject<
  RESULT,
  INPUT extends BodyInit = any,
  HEARTBEAT extends {} = any,
>({
  api,
  id,
  schema,
  initialValue,
  fetch,
  onError,
  onFinish,
  isHeartbeat,
  debugDelay,
}: Experimental_UseObjectOptions<
  RESULT,
  HEARTBEAT
>): Experimental_UseObjectHelpers<RESULT, INPUT> {
  // Generate an unique id if not provided.
  const hookId = useId();
  const completionId = id ?? hookId;
  const isInitialDataSet = useRef(false);

  // Buffer to store incomplete chunks
  const incompleteChunkRef = useRef<string>('');

  // @ts-ignore
  const processChunkOld = useCallback(
    <R, H>(
      chunk: string,
      isHeartbeat?: (object: DeepPartial<H>) => boolean,
    ): DeepPartial<R> | undefined => {
      // Append the new chunk to any incomplete chunk we have
      const fullChunk = incompleteChunkRef.current + chunk;
      let endIndex = fullChunk.length;
      let lastValidObject: DeepPartial<R> | undefined = undefined;

      while (endIndex > 0) {
        // Find the last closing brace
        const lastClosingBrace = fullChunk.lastIndexOf('}', endIndex - 1);
        if (lastClosingBrace === -1) {
          // No complete object found, store the entire chunk as incomplete
          incompleteChunkRef.current = fullChunk.slice(0, endIndex);
          break;
        }

        // Find the matching opening brace by counting braces
        let openBraces = 0;
        let startIndex = lastClosingBrace;

        while (startIndex >= 0) {
          if (fullChunk[startIndex] === '}') openBraces++;
          if (fullChunk[startIndex] === '{') openBraces--;
          if (openBraces === 0) break;
          startIndex--;
        }

        // If we found a matching pair of braces
        if (startIndex >= 0) {
          try {
            const potentialObject = fullChunk.slice(
              startIndex,
              lastClosingBrace + 1,
            );
            const value = parsePartial(potentialObject);

            if (isHeartbeat && isHeartbeat(value as DeepPartial<H>)) {
              endIndex = startIndex;
              continue;
            }

            lastValidObject = value as DeepPartial<R>;
            // Store any remaining incomplete chunk
            incompleteChunkRef.current = fullChunk.slice(0, startIndex);
            break;
          } catch (parseError) {
            // If parsing fails, try the next closing brace
            endIndex = startIndex;
          }
        } else {
          // If no matching opening brace was found, try the next closing brace
          endIndex = lastClosingBrace;
        }
      }

      return lastValidObject;
    },
    [],
  );

  const processChunk = useCallback(
    <R, H>(
      chunk: string,
      isHeartbeat?: (object: DeepPartial<H>) => boolean,
    ): DeepPartial<R> | undefined => {
      // Combine with any previously incomplete chunk
      const fullChunk = incompleteChunkRef.current + chunk;

      // Try to find the last complete object by working backwards
      let openBraces = 0;
      let lastCompleteEnd = -1;
      let lastCompleteStart = -1;

      // First pass: find the last complete object
      for (let i = fullChunk.length - 1; i >= 0; i--) {
        if (fullChunk[i] === '}') {
          if (openBraces === 0) {
            lastCompleteEnd = i;
          }
          openBraces++;
        } else if (fullChunk[i] === '{') {
          openBraces--;
          if (openBraces === 0 && lastCompleteEnd !== -1) {
            lastCompleteStart = i;
            break;
          }
        }
      }

      // If we found a complete object
      if (lastCompleteStart !== -1 && lastCompleteEnd !== -1) {
        try {
          const potentialObject = fullChunk.slice(
            lastCompleteStart,
            lastCompleteEnd + 1,
          );

          const value = parsePartial(potentialObject);

          if (isHeartbeat && isHeartbeat(value as DeepPartial<H>)) {
            // Store anything after this heartbeat object
            incompleteChunkRef.current = fullChunk.slice(lastCompleteEnd + 1);
            return undefined;
          }

          // Store anything after this complete object for next time
          incompleteChunkRef.current = fullChunk.slice(lastCompleteEnd + 1);
          return value as DeepPartial<R>;
        } catch (e) {
          // eslint-disable-next-line no-console
          console.log('Parse error:', e);
        }
      }

      // If we have unclosed braces at the end, this might be a partial object
      if (openBraces > 0) {
        incompleteChunkRef.current = fullChunk;
        return undefined;
      }

      // If we get here and have no complete objects, store everything
      incompleteChunkRef.current = fullChunk;
      return undefined;
    },
    [],
  );

  // Store the completion state in SWR, using the completionId as the key to share states.
  const { data, mutate } = useSWR<DeepPartial<RESULT> | undefined>(
    [api, completionId],
    null,
  );

  useEffect(() => {
    if (initialValue && !isInitialDataSet.current) {
      isInitialDataSet.current = true;
      mutate(initialValue);
    }
  }, [initialValue, mutate]);

  const [error, setError] = useState<undefined | Error>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  // Abort controller to cancel the current API call.
  const abortControllerRef = useRef<AbortController | null>(null);

  const stop = useCallback(() => {
    try {
      abortControllerRef.current?.abort();
    } catch (ignored) {
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, []);

  const clear = useCallback(() => {
    mutate(undefined, false);
    setIsLoading(false);
    setError(undefined);
  }, [mutate, setIsLoading, setError]);

  const submit = async (input: INPUT, fetchOptions?: RequestInit) => {
    try {
      mutate(undefined); // reset the data
      setIsLoading(true);
      setError(undefined);
      // Reset the incomplete chunk buffer when starting a new request
      incompleteChunkRef.current = '';

      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      const actualFetch = getOriginalFetch(fetch, debugDelay);

      const response = await actualFetch(api, {
        ...fetchOptions,
        body: input,
      });

      if (!response.ok) {
        throw new Error(
          (await response.text()) ?? 'Failed to fetch the response.',
        );
      }

      if (response.body == null) {
        throw new Error('The response body is empty.');
      }

      let latestObject: DeepPartial<RESULT> | undefined = undefined;
      let lastChunkVersion = 0;

      await response.body.pipeThrough(new TextDecoderStream()).pipeTo(
        new WritableStream<string>({
          async write(chunk) {
            //eslint-disable-next-line no-console
            console.log('chunk', { chunk });

            const currentObject = processChunk<RESULT, HEARTBEAT>(
              chunk,
              isHeartbeat,
            );

            //eslint-disable-next-line no-console
            console.log('currentObject', { currentObject });

            if (
              currentObject &&
              !isDeepEqualData(latestObject, currentObject) &&
              currentObject.chunkVersion > lastChunkVersion
            ) {
              latestObject = currentObject;
              lastChunkVersion = currentObject.chunkVersion ?? lastChunkVersion;
              mutate(currentObject);
            }
          },

          close() {
            // Reset the incomplete chunk buffer when the stream closes
            incompleteChunkRef.current = '';
            setIsLoading(false);
            abortControllerRef.current = null;

            if (onFinish != null) {
              const validationResult = safeValidateTypes({
                value: latestObject,
                schema: asSchema(schema),
              });

              onFinish(
                validationResult.success
                  ? { object: validationResult.value, error: undefined }
                  : { object: undefined, error: validationResult.error },
              );
            }
          },
        }),
      );
    } catch (error) {
      // Reset the incomplete chunk buffer on error
      incompleteChunkRef.current = '';

      if (isAbortError(error)) {
        return;
      }

      if (onError && error instanceof Error) {
        onError(error);
      }

      setIsLoading(false);
      setError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  return {
    submit,
    object: data,
    error,
    isLoading,
    stop,
    clear,
  };
}

export const experimental_useObject = useObject;
