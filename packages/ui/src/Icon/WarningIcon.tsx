/** 12px filled circle with an exclamation mark, coloured by `currentColor`. Decorative. */
export function WarningIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      aria-hidden="true"
      focusable="false"
      style={{ flex: 'none' }}
    >
      <circle cx="6" cy="6" r="6" fill="currentColor" />
      <path d="M6 3v3.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="6" cy="8.75" r="0.9" fill="#fff" />
    </svg>
  );
}
