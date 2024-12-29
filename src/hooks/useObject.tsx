import {
  FetchFunction,
  isAbortError,
  safeValidateTypes,
} from '@ai-sdk/provider-utils';
import {
  asSchema,
  DeepPartial,
  isDeepEqualData,
  parsePartialJson,
  Schema,
} from '@ai-sdk/ui-utils';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import useSWR from 'swr';
import z from 'zod';

import { parse as parseJson } from 'partial-json';

// use function to allow for mocking in tests:
const getOriginalFetch = () => fetch;

export type Experimental_UseObjectOptions<RESULT> = {
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

export function useObject<RESULT, INPUT extends BodyInit = any>({
  api,
  id,
  schema, // required, in the future we will use it for validation
  initialValue,
  fetch,
  onError,
  onFinish,
  headers,
}: Experimental_UseObjectOptions<RESULT>): Experimental_UseObjectHelpers<
  RESULT,
  INPUT
> {
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

      const actualFetch = fetch ?? getOriginalFetch();

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

      let accumulatedText = '';
      let latestObject: DeepPartial<RESULT> | undefined = undefined;

      await response.body.pipeThrough(new TextDecoderStream()).pipeTo(
        new WritableStream<string>({
          write(chunk) {
            if (chunk.trim() === '' || chunk.trim() === '{}') return;

            accumulatedText = chunk;

            const { value } = parsePartialJson(accumulatedText);
            const currentObject = value as DeepPartial<RESULT>;

            if (!isDeepEqualData(latestObject, currentObject)) {
              latestObject = currentObject;

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
