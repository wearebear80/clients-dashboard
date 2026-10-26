import { ClientsAnalytics } from '../components/index.ts';
import { AppErrorBoundary } from './AppErrorBoundary.tsx';
import styles from './App.module.scss';

// Hardcoded. In a real app we assume the product has many companies and the user lands on this
// dashboard from another page (e.g. a company list) that already knows the id
export const COMPANY_ID = 'd6e00056-dce4-4ef4-b034-d6467db6187d';

export function App() {
  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Clients</h1>
      <AppErrorBoundary>
        <ClientsAnalytics companyId={COMPANY_ID} />
      </AppErrorBoundary>
    </main>
  );
}
