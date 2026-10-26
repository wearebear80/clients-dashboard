import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StackedBarChart, type ChartSeries } from './StackedBarChart.tsx';

const categories = ['Jan', 'Feb'];
const series: ChartSeries[] = [
  { id: 'existing', label: 'Existing clients', color: 'purple', values: [30, 20] },
  { id: 'paid', label: 'New paid', color: 'red', values: [10, 0] },
];

const renderChart = () => render(<StackedBarChart categories={categories} series={series} />);

function segmentHeights(container: HTMLElement, seriesId: string): number[] {
  return [...container.querySelectorAll(`.series-${seriesId} .recharts-rectangle`)].map((el) =>
    Number(el.getAttribute('height')),
  );
}

describe('StackedBarChart', () => {
  it('stacks series per category with heights proportional to values', () => {
    const { container } = renderChart();

    const [existingJan = 0, existingFeb = 0] = segmentHeights(container, 'existing');
    const [paidJan = 0] = segmentHeights(container, 'paid');

    expect(existingJan).toBeGreaterThan(0);
    expect(existingJan / paidJan).toBeCloseTo(30 / 10);
    expect(existingJan / existingFeb).toBeCloseTo(30 / 20);
    expect(segmentHeights(container, 'paid')).toHaveLength(1); // zero value draws nothing
  });

  it('draws a mark above each marked category', () => {
    const { container } = render(
      <StackedBarChart categories={categories} series={series} markers={['Feb']} />,
    );

    expect(container.querySelectorAll('[data-flag]')).toHaveLength(1);
  });

  it('puts each mark on its own category, also when some segments are zero', () => {
    const { container } = render(
      <StackedBarChart
        categories={['Jan', 'Feb', 'Mar']}
        series={[
          { id: 'a', label: 'A', color: 'purple', values: [10, 10, 10] },
          { id: 'b', label: 'B', color: 'red', values: [0, 5, 5] },
        ]}
        markers={['Mar']}
      />,
    );
    const flags = [...container.querySelectorAll('[data-flag]')];
    const bars = [...container.querySelectorAll('.series-b .recharts-rectangle')];

    expect(flags).toHaveLength(1);
    // The mark is centred over the Mar column, the last bar of series B.
    const mar = bars.at(-1)!;
    const marCentre = Number(mar.getAttribute('x')) + Number(mar.getAttribute('width')) / 2;
    const flagX = Number(/translate\(([\d.]+)/.exec(flags[0]!.getAttribute('transform')!)?.[1]);
    expect(flagX + 6).toBeCloseTo(marCentre, 0);
  });
});
