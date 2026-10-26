import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button, Card } from '@app/ui';
import styles from './AppErrorBoundary.module.scss';

export interface AppErrorBoundaryProps {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/** Catches render errors (e.g. unexpected data), so the page shows a message instead of going blank. */
export class AppErrorBoundary extends Component<AppErrorBoundaryProps, State> {
  override state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    // The place to report to monitoring (e.g. Sentry).
    console.error(error, info.componentStack);
  }

  override render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <Card p={16} className={styles.error} role="alert">
        <p>Something went wrong.</p>
        <Button onClick={() => window.location.reload()}>Reload</Button>
      </Card>
    );
  }
}
