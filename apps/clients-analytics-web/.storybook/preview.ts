import type { Preview } from '@storybook/react-vite';
import '@app/ui/tokens.css';
import '../src/global.scss';

/** Page-level rules: a single component is not a page. `Pages/*` stories turn them back on. */
export const PAGE_RULES = ['landmark-one-main', 'page-has-heading-one', 'region'];

const preview: Preview = {
  parameters: {
    layout: 'padded',
    a11y: {
      test: 'error',
      config: { rules: PAGE_RULES.map((id) => ({ id, enabled: false })) },
    },
  },
};

export default preview;
