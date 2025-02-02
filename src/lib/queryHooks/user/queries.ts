import userService from '@/services/userService';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

export function useUser(
  queryOptions?: Partial<
    UseQueryOptions<Awaited<ReturnType<typeof userService.getUser>>>
  >,
) {
  return useQuery({
    queryKey: ['user'],
    queryFn: userService.getUser,
    staleTime: 1000 * 60, ///< 1min
    ...queryOptions,
  });
}
