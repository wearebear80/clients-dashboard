import type { ChartSeries } from '@app/ui';
import type { ClientRow } from '../../../models/index.ts';

/** Channels keep their design colours; other rows (branches, advisers) take the palette in order. */
const CHANNEL_COLORS: Record<string, string> = {
  'Existing clients': 'var(--color-series-existing)',
  'New organic': 'var(--color-series-organic)',
  'New paid': 'var(--color-series-paid)',
};

const PALETTE = [
  'var(--color-series-existing)',
  'var(--color-series-organic)',
  'var(--color-series-paid)',
  'var(--color-series-other)',
  'var(--color-series-blue)',
  'var(--color-series-sand)',
];

/**
 * A row's monthly values, stacked by its children (company → branches → advisers → channels);
 * a row without children is a single series.
 */
export function toChartSeries(row: ClientRow): ChartSeries[] {
  if (row.children.length === 0) {
    return [{ id: row.id, label: row.name, color: PALETTE[0]!, values: row.values }];
  }

  return row.children.map((child, i) => ({
    id: child.id,
    label: child.name,
    color: CHANNEL_COLORS[child.name] ?? PALETTE[i % PALETTE.length]!,
    values: child.values,
  }));
}
