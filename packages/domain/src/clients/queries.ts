import { useQuery } from '@tanstack/react-query';
import { getCompany } from './requests.ts';
import type { RequestOptions } from './types.ts';

/** Search params change the response (e.g. dev knobs), so they are part of the key. */
export const companyQueryKey = (id: string, searchParams?: URLSearchParams) =>
  ['company', id, searchParams?.toString() ?? ''] as const;

export function useCompany(
  id: string,
  { searchParams }: Pick<RequestOptions, 'searchParams'> = {},
) {
  return useQuery({
    queryKey: companyQueryKey(id, searchParams),
    queryFn: ({ signal }) => getCompany(id, { signal, searchParams }),
    staleTime: Infinity, // static data set; refetch only on explicit retry
  });
}
