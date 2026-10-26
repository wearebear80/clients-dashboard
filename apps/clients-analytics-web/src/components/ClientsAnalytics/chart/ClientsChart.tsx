import { useMemo } from 'react';
import { Card, StackedBarChart } from '@app/ui';
import type { ClientRow } from '../../../models/index.ts';
import { describeMismatch } from '../describeMismatch.ts';
import { createChartConfig } from './createChartConfig.ts';
import styles from './ClientsChart.module.scss';

export interface ClientsChartProps {
  /** The row selected in the table, stacked by its children. */
  row: ClientRow;
  months: string[];
}

export function ClientsChart({ row, months }: ClientsChartProps) {
  const { sums, ...chart } = useMemo(() => createChartConfig(row, months), [row, months]);

  return (
    <Card pt={24} px={16} pb={16}>
      {/* Visual only, like the chart: the table carries the same data for screen readers. */}
      <div className={styles.chartHeader} aria-hidden="true">
        <span className={styles.chartTitle}>{row.name}</span>
        <span className={styles.chartHint}>Select a row in the table to see it here</span>
      </div>
      <StackedBarChart
        {...chart}
        renderTooltipNote={(month, i) =>
          chart.markers.includes(month) && (
            <p className={styles.mismatch}>{describeMismatch(row.values[i] ?? 0, sums[i] ?? 0)}</p>
          )
        }
      />
    </Card>
  );
}
