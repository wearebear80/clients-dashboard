import styles from './ChevronIcon.module.scss';

export interface ChevronIconProps {
  expanded: boolean;
}

export function ChevronIcon({ expanded }: ChevronIconProps) {
  return (
    <svg
      className={styles.icon}
      data-expanded={expanded}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M11.5 6.5L8 10L4.5 6.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
    </svg>
  );
}
