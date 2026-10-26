import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from '@app/ui';
import { companyPayload } from '@app/domain/clients/fixtures';
import { App } from './App.tsx';

// Patched once: per-story patch-and-restore races when Storybook switches stories, and a
// restored real `fetch` then hits the Storybook server (404). Stories only swap the response.
let respond: () => Promise<Response> = () => new Promise<Response>(() => {});
const realFetch = globalThis.fetch;
globalThis.fetch = (input, init) => {
  const url = input instanceof Request ? input.url : String(input);
  return url.includes('/api/') ? respond() : realFetch(input, init);
};

const mockFetch = (response: () => Promise<Response>) => () => {
  respond = response;
};

const json = (status: number, body: unknown) => Promise.resolve(Response.json(body, { status }));

const meta = {
  title: 'Pages/App',
  component: App,
  // A whole page: all axe rules apply, including the page-level ones.
  parameters: { layout: 'fullscreen', a11y: { config: { rules: [] } } },
  beforeEach: mockFetch(() => json(200, companyPayload)),
  decorators: [
    (Story, { parameters }) => {
      const [client] = useState(
        () => new QueryClient({ defaultOptions: { queries: { retry: false } } }),
      );
      return (
        <QueryClientProvider client={client}>
          <ToastProvider>
            <div
              style={{
                maxWidth: parameters.containerWidth as number | undefined,
                transform: 'translateZ(0)',
              }}
            >
              <Story />
            </div>
          </ToastProvider>
        </QueryClientProvider>
      );
    },
  ],
} satisfies Meta<typeof App>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Narrow: Story = {
  parameters: { containerWidth: 375 },
};

export const Loading: Story = {
  beforeEach: mockFetch(() => new Promise<Response>(() => {})),
};

export const Error: Story = {
  beforeEach: mockFetch(() =>
    json(503, { error: { code: 'UNAVAILABLE', message: 'Request failed with status 503' } }),
  ),
};
