import { useCallback, useState } from 'react';
import { Card, Skeleton, VisuallyHidden } from '@app/ui';
import { useClientsData } from '../../hooks/useClientsData.ts';
import { findRow } from '../../models/index.ts';
import { ClientsLoadingError } from '../ClientsLoadingError/ClientsLoadingError.tsx';
import { ClientsChart } from './chart/ClientsChart.tsx';
import { ClientsTable } from './table/ClientsTable.tsx';

export interface ClientsAnalyticsProps {
  companyId: string;
}

export function ClientsAnalytics({ companyId }: ClientsAnalyticsProps) {
  const { company, inconsistencies, months, isLoading, isError, isRetrying, retry } =
    useClientsData(companyId);

  const [selectedId, setSelectedId] = useState<string>();
  const selectRow = useCallback((id: string) => setSelectedId(id), []);

  if (isLoading) {
    return (
      <>
        <VisuallyHidden role="status">Loading clients…</VisuallyHidden>
        <Card pt={24} px={16} pb={16}>
          <Skeleton height={426} />
        </Card>
        <Card p={16}>
          <Skeleton height={248} />
        </Card>
      </>
    );
  }
  if (isError || !company || !inconsistencies) {
    return <ClientsLoadingError onRetry={retry} retrying={isRetrying} />;
  }

  const selected = (selectedId && findRow(company, selectedId)) || company;

  return (
    <>
      <ClientsChart row={selected} months={months} />
      <ClientsTable
        company={company}
        months={months}
        inconsistencies={inconsistencies}
        selectedId={selected.id}
        onSelect={selectRow}
      />
    </>
  );
}
