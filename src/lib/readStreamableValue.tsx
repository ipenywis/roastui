import { StreamableValue } from 'ai/rsc';

export const STREAMABLE_VALUE_TYPE = Symbol.for('ui.streamable.value');

export function isStreamableValue(value: unknown): value is StreamableValue {
  return (
    value != null &&
    typeof value === 'object' &&
    'type' in value &&
    value.type === STREAMABLE_VALUE_TYPE
  );
}

export function readStreamableValue<T = unknown>(
  streamableValue: StreamableValue<T>,
): AsyncIterable<T | undefined> {
  if (!isStreamableValue(streamableValue)) {
    throw new Error(
      'Invalid value: this hook only accepts values created via `createStreamableValue`.',
    );
  }

  return {
    [Symbol.asyncIterator]() {
      let row: StreamableValue<T> | Promise<StreamableValue<T>> =
        streamableValue;
      // @ts-ignore
      let value = row.curr; // the current value
      let isDone = false;
      let isFirstIteration = true;

      return {
        async next() {
          // the iteration is done already, return the last value:
          if (isDone) return { value, done: true };

          // resolve the promise at the beginning of each iteration:
          row = await row;

          // throw error if any:
          // @ts-ignore
          if (row.error !== undefined) {
            // @ts-ignore
            throw row.error;
          }

          // if there is a value or a patch, use it:
          // @ts-ignore
          if ('curr' in row || row.diff) {
            // @ts-ignore
            if (row.diff) {
              // streamable patch (text only):
              // @ts-ignore
              if (row.diff[0] === 0) {
                if (typeof value !== 'string') {
                  throw new Error(
                    'Invalid patch: can only append to string types. This is a bug in the AI SDK.',
                  );
                }

                // casting required to remove T & string limitation
                // @ts-ignore
                (value as string) = value + row.diff[1];
              }
            } else {
              // replace the value (full new value)
              // @ts-ignore
              value = row.curr;
            }

            // The last emitted { done: true } won't be used as the value
            // by the for await...of syntax.
            // @ts-ignore
            if (!row.next) {
              isDone = true;
              return { value, done: false };
            }
          }

          // there are no further rows to iterate over:
          // @ts-ignore
          if (row.next === undefined) {
            return { value, done: true };
          }
          // @ts-ignore
          row = row.next;

          if (isFirstIteration) {
            isFirstIteration = false; // TODO should this be set for every return?

            if (value === undefined) {
              // This is the initial chunk and there isn't an initial value yet.
              // Let's skip this one.
              return this.next();
            }
          }

          return { value, done: false };
        },
      };
    },
  };
}
