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

    if (!response.body || !debugDelay) return response;

    const [min, max] = debugDelay;
    const delayStream = new TransformStream({
      async transform(chunk, controller) {
        await new Promise((resolve) =>
          setTimeout(resolve, Math.random() * (max - min) + min),
        );
        controller.enqueue(chunk);
      },
    });

    return new Response(response.body.pipeThrough(delayStream), response);
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

const processChunk = <RESULT, HEARTBEAT>(
  chunk: string,
  isHeartbeat?: (object: DeepPartial<HEARTBEAT>) => boolean,
): DeepPartial<RESULT> | undefined => {
  let endIndex = chunk.length;

  while (endIndex > 0) {
    // Find the last closing brace
    const lastClosingBrace = chunk.lastIndexOf('}', endIndex - 1);
    if (lastClosingBrace === -1) break;

    // Find the matching opening brace by counting braces
    let openBraces = 0;
    let startIndex = lastClosingBrace;

    while (startIndex >= 0) {
      if (chunk[startIndex] === '}') openBraces++;
      if (chunk[startIndex] === '{') openBraces--;
      if (openBraces === 0) break;
      startIndex--;
    }

    // If we found a matching pair of braces
    if (startIndex >= 0) {
      try {
        const potentialObject = chunk.slice(startIndex, lastClosingBrace + 1);
        const value = parsePartial(potentialObject);

        if (isHeartbeat && isHeartbeat(value as DeepPartial<HEARTBEAT>)) {
          return undefined;
        }

        return value as DeepPartial<RESULT>;
      } catch (parseError) {
        // If parsing fails, continue with the next closing brace
        endIndex = startIndex;
      }
    } else {
      // If no matching opening brace was found, try the next closing brace
      endIndex = lastClosingBrace;
    }
  }
  return undefined;
};

export function useObject<
  RESULT,
  INPUT extends BodyInit = any,
  HEARTBEAT extends {} = any,
>({
  api,
  id,
  schema, // required, in the future we will use it for validation
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
            const currentObject = processChunk<RESULT, HEARTBEAT>(
              chunk,
              isHeartbeat,
            );

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
