import { describe, expect, it } from 'vitest';
import { companyPayload } from '@app/domain/clients/fixtures';
import { toClientRow, type ClientRow } from '../../../models/index.ts';
import { toChartSeries } from './toChartSeries.ts';

const company = toClientRow(companyPayload);
const find = (row: ClientRow, name: string): ClientRow | undefined =>
  row.name === name ? row : row.children.map((child) => find(child, name)).find(Boolean);
const month = (series: ReturnType<typeof toChartSeries>, i: number) =>
  series.map((s) => [s.label, s.values[i]]);

describe('toChartSeries', () => {
  it('stacks the company by branches', () => {
    expect(month(toChartSeries(company), 0)).toEqual([
      ['Branch 1', 147],
      ['Branch 2', 76],
      ['Branch 3', 27],
    ]);
  });

  it('stacks an adviser by channels, in the design colours', () => {
    const series = toChartSeries(find(company, 'Anna Blackwood')!);

    expect(month(series, 0)).toEqual([
      ['Existing clients', 25],
      ['New organic', 0],
      ['New paid', 0],
    ]);
    expect(series[0]?.color).toBe('var(--color-series-existing)');
  });

  it('gives a single series for a row without children', () => {
    const branch2 = find(company, 'Branch 2')!;

    expect(toChartSeries(branch2)).toEqual([
      expect.objectContaining({ label: 'Branch 2', values: branch2.values }),
    ]);
  });
});
