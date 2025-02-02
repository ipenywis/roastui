import { StandardApiResponse } from '@/types/response';

export function makeStandardApiResponse<T>(
  response: T,
): StandardApiResponse<T> {
  return {
    data: response,
  };
}
