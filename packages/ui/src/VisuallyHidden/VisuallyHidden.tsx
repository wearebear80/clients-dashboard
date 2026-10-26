import { clsx } from 'clsx';
import type { ComponentPropsWithoutRef } from 'react';
import styles from './VisuallyHidden.module.scss';

export type VisuallyHiddenProps = ComponentPropsWithoutRef<'div'>;

export function VisuallyHidden({ className, ...props }: VisuallyHiddenProps) {
  return <div className={clsx(styles.root, className)} {...props} />;
}
