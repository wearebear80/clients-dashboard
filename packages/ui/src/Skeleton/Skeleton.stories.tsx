import type { Meta, StoryObj } from '@storybook/react-vite';
import { Skeleton } from './Skeleton.tsx';

const meta = {
  title: 'UI/Skeleton',
  component: Skeleton,
  // Static in baselines: a pulse frame would make screenshots flaky.
  args: { height: 120, animated: false },
} satisfies Meta<typeof Skeleton>;

export default meta;

export const Default: StoryObj<typeof meta> = {};
