import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button/Button.tsx';
import { Toast, ToastViewport } from './Toast.tsx';
import { ToastProvider, useToast } from './ToastProvider.tsx';

const meta = {
  title: 'UI/Toast',
  component: Toast,
  args: { title: 'Could not load clients', description: 'Request failed with status 503' },
  decorators: [
    (Story) => (
      // `transform` makes this box the containing block of the fixed viewport, so the story
      // (and its screenshot) has a size.
      <div style={{ height: 120, transform: 'translateZ(0)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Error: Story = {
  args: { tone: 'error', onClose: () => {} },
  render: (args) => (
    <ToastViewport>
      <Toast {...args} />
    </ToastViewport>
  ),
};

export const Info: Story = {
  args: { tone: 'info', title: 'Data refreshed', description: undefined },
  render: (args) => (
    <ToastViewport>
      <Toast {...args} />
    </ToastViewport>
  ),
};

function OpenToastButton() {
  const toast = useToast();
  return (
    <Button
      onClick={() =>
        toast.open({ tone: 'error', title: 'Could not load clients', description: 'Try again' })
      }
    >
      Show error toast
    </Button>
  );
}

export const Imperative: Story = {
  render: () => (
    <ToastProvider>
      <OpenToastButton />
    </ToastProvider>
  ),
};
