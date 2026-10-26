import type { Meta, StoryObj } from '@storybook/react-vite';
import { VisuallyHidden } from './VisuallyHidden.tsx';

const meta = {
  title: 'UI/VisuallyHidden',
  component: VisuallyHidden,
  args: { children: 'Read by screen readers only' },
  decorators: [
    (Story) => (
      <p style={{ font: 'var(--font-body)' }}>
        Visible text before, <Story /> visible text after.
      </p>
    ),
  ],
} satisfies Meta<typeof VisuallyHidden>;

export default meta;

export const Default: StoryObj<typeof meta> = {};
