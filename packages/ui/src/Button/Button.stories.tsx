import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button.tsx';

const meta = {
  title: 'UI/Button',
  component: Button,
  args: { children: 'Retry' },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Secondary: Story = {};
export const Primary: Story = { args: { variant: 'primary' } };
export const Disabled: Story = { args: { disabled: true, children: 'Retrying…' } };
