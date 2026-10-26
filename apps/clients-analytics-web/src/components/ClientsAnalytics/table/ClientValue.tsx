import { Tooltip, VisuallyHidden, WarningIcon } from '@app/ui';
import { describeMismatch } from '../describeMismatch.ts';
import styles from './ClientValue.module.scss';

export interface ClientValueProps {
  value: number;
  /**
   * Where the value is, e.g. "Company, May 2024". Read before the value: VoiceOver otherwise reads
   * only the number when moving between cells.
   */
  context: string;
  /** Set when the value does not match the sum of its rows. */
  sumOfChildren?: number;
}

export function ClientValue({ value, context, sumOfChildren }: ClientValueProps) {
  if (sumOfChildren === undefined) {
    return (
      <>
        <VisuallyHidden>{`${context}: `}</VisuallyHidden>
        {value}
      </>
    );
  }

  const mismatch = describeMismatch(value, sumOfChildren);
  return (
    <Tooltip
      content={
        <>
          <strong className={styles.tooltipTitle}>Total does not match its rows</strong>
          {mismatch}
        </>
      }
    >
      {/* Focus lands on the button, not the cell, so the label carries the cell's context too. */}
      <button
        type="button"
        className={styles.mismatch}
        aria-label={`${context}: ${value}. Total does not match its rows. ${mismatch}`}
      >
        <WarningIcon />
        {value}
      </button>
    </Tooltip>
  );
}
