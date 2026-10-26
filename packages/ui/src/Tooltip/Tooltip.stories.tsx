import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tooltip } from './Tooltip.tsx';

const meta = {
  title: 'UI/Tooltip',
  component: Tooltip,
  args: {
    content: 'A short hint about this value.',
    children: <button type="button">301</button>,
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '64px 120px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Open: Story = { args: { defaultOpen: true } };
