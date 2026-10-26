import type { ChartSeries } from '@app/ui';
import type { ClientRow } from '../../../models/index.ts';
import { toChartSeries } from './toChartSeries.ts';

export interface ChartConfig {
  categories: string[];
  series: ChartSeries[];
  /** The row's own values: the tooltip total, as in the table. */
  totals: number[];
  /** Months where the children do not add up to the row. */
  markers: string[];
  /** Per month: what the children add up to. */
  sums: number[];
}

/** The selected row stacked by its children; months where they do not add up to it are marked. */
export function createChartConfig(row: ClientRow, months: string[]): ChartConfig {
  const series = toChartSeries(row);
  const sums = months.map((_, i) => series.reduce((sum, s) => sum + (s.values[i] ?? 0), 0));

  return {
    categories: months,
    series,
    totals: row.values,
    markers: months.filter((_, i) => sums[i] !== row.values[i]),
    sums,
  };
}
