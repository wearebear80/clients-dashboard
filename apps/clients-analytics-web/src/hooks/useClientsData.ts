import { useEffect, useMemo, useState } from 'react';
import { findInconsistencies, type Inconsistency } from '@app/domain/clients';
import { useCompany } from '@app/domain/clients/queries';
import { useToast } from '@app/ui';
import { toClientRow, type ClientRow } from '../models/index.ts';
import { clearSimulatedFailure, debugSearchParams } from '../utils/debug.ts';
import { formatMonth, monthKeys } from '../utils/month.ts';

export interface ClientsData {
  company: ClientRow | undefined;
  inconsistencies: Inconsistency[] | undefined;
  months: string[];
  isLoading: boolean;
  isError: boolean;
  isRetrying: boolean;
  retry: () => void;
}

const MONTHS = monthKeys().map(formatMonth);

export function useClientsData(companyId: string): ClientsData {
  const toast = useToast();
  const [debugParams, setDebugParams] = useState(() =>
    import.meta.env.DEV ? debugSearchParams(window.location.search) : undefined,
  );
  const { data, error, isPending, isFetching, refetch } = useCompany(companyId, {
    searchParams: debugParams,
  });

  useEffect(() => {
    if (error) {
      toast.open({ tone: 'error', title: 'Could not load clients', description: error.message });
    }
  }, [error, toast]);

  const prepared = useMemo(() => {
    if (!data) return undefined;

    return { company: toClientRow(data), inconsistencies: findInconsistencies(data) };
  }, [data]);

  return {
    company: prepared?.company,
    inconsistencies: prepared?.inconsistencies,
    months: MONTHS,
    isLoading: isPending && !error,
    isError: Boolean(error) && !prepared,
    isRetrying: Boolean(error) && isFetching,
    retry: () => {
      // Dev: a failure simulated with `?fail` is dropped on retry, so the retry succeeds.
      if (debugParams?.has('fail')) setDebugParams(clearSimulatedFailure());
      else void refetch();
    },
  };
}
