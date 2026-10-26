import { clsx } from 'clsx';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import styles from './Toast.module.scss';

export type ToastViewportProps = ComponentPropsWithoutRef<'div'>;

export function ToastViewport({ className, ...props }: ToastViewportProps) {
  return <div className={clsx(styles.viewport, className)} {...props} />;
}

export type ToastTone = 'error' | 'info';

export interface ToastProps extends Omit<ComponentPropsWithoutRef<'div'>, 'title' | 'role'> {
  tone?: ToastTone;
  title: ReactNode;
  description?: ReactNode;
  onClose?: () => void;
}

export function Toast({
  tone = 'info',
  title,
  description,
  onClose,
  className,
  ...props
}: ToastProps) {
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={clsx(styles.toast, styles[tone], className)}
      {...props}
    >
      <div className={styles.text}>
        <p className={styles.title}>{title}</p>
        {description && <p className={styles.description}>{description}</p>}
      </div>
      {onClose && (
        <button type="button" className={styles.close} onClick={onClose} aria-label="Dismiss">
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
      )}
    </div>
  );
}
