import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChevronIcon } from './ChevronIcon.tsx';

const meta = {
  title: 'UI/ChevronIcon',
  component: ChevronIcon,
  args: { expanded: false },
} satisfies Meta<typeof ChevronIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Collapsed: Story = {};
export const Expanded: Story = { args: { expanded: true } };
