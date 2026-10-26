import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from '../Card/Card.tsx';
import { StackedBarChart } from './StackedBarChart.tsx';

const MONTHS = [
  'Feb 2024',
  'Mar 2024',
  'Apr 2024',
  'May 2024',
  'Jun 2024',
  'Jul 2024',
  'Aug 2024',
  'Sep 2024',
  'Oct 2024',
  'Nov 2024',
  'Dec 2024',
  'Jan 2025',
];

// Approximated from the Figma mock's bar heights (0.8px per unit), not from the API payload.
const FIGMA_SERIES = [
  {
    id: 'existing',
    label: 'Existing clients',
    color: 'var(--color-series-existing)',
    values: [232, 250, 267, 285, 302, 321, 335, 248, 248, 248, 248, 340],
  },
  {
    id: 'organic',
    label: 'New organic',
    color: 'var(--color-series-organic)',
    values: [6, 5, 8, 6, 10, 6, 6, 6, 6, 6, 6, 10],
  },
  {
    id: 'paid',
    label: 'New paid',
    color: 'var(--color-series-paid)',
    values: [9, 10, 8, 9, 6, 5, 9, 9, 9, 9, 9, 14],
  },
];

const meta = {
  title: 'UI/StackedBarChart',
  component: StackedBarChart,
  args: {
    categories: MONTHS,
    series: FIGMA_SERIES,
  },
  decorators: [
    (Story, { parameters }) => (
      <div style={{ maxWidth: parameters.containerWidth as number | undefined }}>
        <Card pt={24} px={16} pb={16}>
          <Story />
        </Card>
      </div>
    ),
  ],
} satisfies Meta<typeof StackedBarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SingleSeries: Story = {
  args: {
    series: [
      {
        id: 'total',
        label: 'Clients',
        color: 'var(--color-series-existing)',
        values: [76, 80, 84, 87, 90, 92, 94, 75, 75, 75, 75, 91],
      },
    ],
  },
};

export const Narrow: Story = {
  parameters: { containerWidth: 343 },
};
