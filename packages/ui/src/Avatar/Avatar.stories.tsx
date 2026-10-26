import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar } from './Avatar.tsx';

const meta = {
  title: 'UI/Avatar',
  component: Avatar,
  args: { name: 'Anna Blackwood' },
} satisfies Meta<typeof Avatar>;

export default meta;

export const Initials: StoryObj<typeof meta> = {};
