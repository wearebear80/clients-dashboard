import { MONTHS_COUNT, PERIOD_START } from '@app/domain/clients';

export type Month = string;

export function monthKeys(start: Month = PERIOD_START, count = MONTHS_COUNT): Month[] {
  const [year = NaN, month = NaN] = start.split('-').map(Number);
  return Array.from({ length: count }, (_, i) => {
    const total = year * 12 + (month - 1) + i;
    return `${Math.floor(total / 12)}-${String((total % 12) + 1).padStart(2, '0')}`;
  });
}

const monthFormat = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

export function formatMonth(month: Month): string {
  const [year = NaN, monthNumber = NaN] = month.split('-').map(Number);
  return monthFormat.format(new Date(Date.UTC(year, monthNumber - 1, 1)));
}
