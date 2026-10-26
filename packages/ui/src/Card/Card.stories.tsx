import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from './Card.tsx';

const meta = {
  title: 'UI/Card',
  component: Card,
  args: {
    'aria-label': 'Example card',
    children: <div style={{ font: 'var(--font-body)' }}>Card content</div>,
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Padded: Story = { args: { pt: 24, px: 16, pb: 16 } };
