import { Fragment, type ReactNode } from 'react';
import { clsx } from 'clsx';
import {
  Bar,
  BarChart,
  BarStack,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { niceScale } from './scale.ts';
import styles from './StackedBarChart.module.scss';

export interface ChartSeries {
  id: string;
  label: string;
  color: string;
  values: readonly number[];
}

export interface StackedBarChartProps {
  categories: readonly string[];
  series: readonly ChartSeries[];
  /** The total shown per category in the tooltip; defaults to the sum of its series. */
  totals?: readonly number[];
  /** Categories to draw attention to: a warning mark above the column. */
  markers?: readonly string[];
  /** An extra line at the bottom of a category's tooltip, e.g. why it is marked. */
  renderTooltipNote?: (category: string, index: number) => ReactNode;
  height?: number;
  formatValue?: (value: number) => string;
  className?: string;
}

const DEFAULT_HEIGHT = 358;
const X_AXIS_HEIGHT = 28;
const TOP_MARGIN = 10;
const Y_AXIS_WIDTH = 38;
const HALF_COLUMN_GAP = 12;
const BAR_RADIUS = 4;
const TICK_MARGIN = 6;

const defaultFormat = new Intl.NumberFormat('en-US').format;

/** The warning icon, above a marked column. */
function WarningMark({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x - 6}, ${y - 18})`} data-flag="">
      <circle cx="6" cy="6" r="6" fill="var(--color-danger)" />
      <path d="M6 3v3.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="6" cy="8.75" r="0.9" fill="#fff" />
    </g>
  );
}

/**
 * Visual only: hidden from assistive technology on purpose. The chart duplicates data that the
 * page must also offer as a table (here the TreeTable), so screen readers get it there.
 */
export function StackedBarChart({
  categories,
  series,
  totals: givenTotals,
  markers = [],
  renderTooltipNote,
  height = DEFAULT_HEIGHT,
  formatValue = defaultFormat,
  className,
}: StackedBarChartProps) {
  const rows = categories.map((category, i) => ({
    category,
    ...Object.fromEntries(series.map((s) => [s.id, s.values[i] ?? 0])),
  }));
  const sums = categories.map((_, i) => series.reduce((sum, s) => sum + (s.values[i] ?? 0), 0));
  const totals = categories.map((_, i) => givenTotals?.[i] ?? sums[i] ?? 0);
  const isMarked = (i: number) => markers.includes(categories[i] ?? '');
  const scale = niceScale(Math.max(0, ...sums, ...totals));
  // The mark sits on the top visible segment: Recharts draws no label for a zero-height one.
  const topSeriesAt = (i: number) => series.findLast((s) => (s.values[i] ?? 0) > 0)?.id;

  return (
    <div className={clsx(styles.root, className)}>
      {/* aria-hidden on the plot, not the scroller: Chrome makes a scroll container focusable. */}
      <div className={styles.scroller}>
        <div className={styles.plot} aria-hidden="true">
          <ResponsiveContainer
            width="100%"
            height={height}
            initialDimension={{ width: 1024, height }}
          >
            <BarChart
              data={rows}
              margin={{ top: TOP_MARGIN, right: 0, bottom: 0, left: 0 }}
              barCategoryGap={HALF_COLUMN_GAP}
              // On by default in Recharts 3: makes the aria-hidden SVG focusable.
              accessibilityLayer={false}
            >
              <CartesianGrid vertical={false} strokeDasharray="1 6" />
              <XAxis
                dataKey="category"
                axisLine={false}
                tickLine={false}
                interval={0}
                height={X_AXIS_HEIGHT}
                tickMargin={TICK_MARGIN}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                width={Y_AXIS_WIDTH}
                tickMargin={TICK_MARGIN}
                domain={[0, scale.max]}
                ticks={scale.ticks}
                tickFormatter={formatValue}
              />
              <Tooltip
                cursor={{ fill: 'var(--color-surface-secondary)' }}
                isAnimationActive={false}
                content={({ active, label: category }) => {
                  const i = categories.indexOf(String(category));
                  if (!active || i < 0) return null;
                  return (
                    <div className={styles.tooltip}>
                      <p className={styles.tooltipTitle}>{category}</p>
                      <dl className={styles.tooltipList}>
                        {/* Top to bottom, as stacked. */}
                        {series.toReversed().map((s) => (
                          <Fragment key={s.id}>
                            <dt>
                              <span className={styles.swatch} style={{ background: s.color }} />
                              {s.label}
                            </dt>
                            <dd>{formatValue(s.values[i] ?? 0)}</dd>
                          </Fragment>
                        ))}
                        <dt className={styles.tooltipTotal}>Total</dt>
                        <dd className={styles.tooltipTotal}>{formatValue(totals[i] ?? 0)}</dd>
                      </dl>
                      {renderTooltipNote && (
                        <div className={styles.tooltipNote}>
                          {renderTooltipNote(String(category), i)}
                        </div>
                      )}
                    </div>
                  );
                }}
              />
              {/* Rounds only the outer corners of each whole column, as in the design. */}
              <BarStack radius={BAR_RADIUS}>
                {series.map((s) => (
                  <Bar
                    key={s.id}
                    dataKey={s.id}
                    name={s.label}
                    fill={s.color}
                    className={`series-${s.id.replace(/\s+/g, '-')}`}
                    isAnimationActive={false}
                  >
                    <LabelList
                      // The category, not `index`: Recharts skips zero-height segments, so indexes shift.
                      dataKey="category"
                      content={({ x, y, width, value }) => {
                        const i = categories.indexOf(String(value));
                        return isMarked(i) && topSeriesAt(i) === s.id ? (
                          <WarningMark x={Number(x) + Number(width) / 2} y={Number(y)} />
                        ) : null;
                      }}
                    />
                  </Bar>
                ))}
              </BarStack>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <ul className={styles.legend} aria-hidden="true">
        {series.map((s) => (
          <li key={s.id} className={styles.legendItem}>
            <span className={styles.swatch} style={{ background: s.color }} />
            {s.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
