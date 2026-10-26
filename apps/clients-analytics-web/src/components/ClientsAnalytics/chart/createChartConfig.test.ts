import { describe, expect, it } from 'vitest';
import { companyPayload } from '@app/domain/clients/fixtures';
import { toClientRow } from '../../../models/index.ts';
import { formatMonth, monthKeys } from '../../../utils/month.ts';
import { createChartConfig } from './createChartConfig.ts';

const months = monthKeys().map(formatMonth);
const company = toClientRow(companyPayload);

describe('createChartConfig', () => {
  it('marks the months where the children do not add up to the row, both ways', () => {
    const branch1 = company.children[0]!;

    expect(createChartConfig(company, months).markers).toEqual(['May 2024']); // 301 vs 279
    expect(createChartConfig(branch1, months).markers).toEqual(['Aug 2024']); // 214 vs 216
  });

  it("shows the row's own values as the totals, as the table does", () => {
    const { totals, sums } = createChartConfig(company, months);

    expect(totals[3]).toBe(301);
    expect(sums[3]).toBe(279);
  });
});
