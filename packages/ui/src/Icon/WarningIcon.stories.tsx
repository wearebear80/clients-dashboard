import type { Meta, StoryObj } from '@storybook/react-vite';
import { WarningIcon } from './WarningIcon.tsx';

const meta = {
  title: 'UI/WarningIcon',
  component: WarningIcon,
  decorators: [
    (Story) => (
      <span style={{ color: 'var(--color-danger)' }}>
        <Story />
      </span>
    ),
  ],
} satisfies Meta<typeof WarningIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
