import { Button, Card } from '@app/ui';
import styles from './ClientsLoadingError.module.scss';

export interface ClientsLoadingErrorProps {
  onRetry: () => void;
  retrying: boolean;
}

export function ClientsLoadingError({ onRetry, retrying }: ClientsLoadingErrorProps) {
  return (
    <Card p={16} className={styles.error} aria-label="Clients could not be loaded">
      <p>Clients could not be loaded.</p>
      <Button onClick={onRetry} disabled={retrying}>
        {retrying ? 'Retrying…' : 'Retry'}
      </Button>
    </Card>
  );
}
