import { clsx } from 'clsx';
import type { ComponentPropsWithoutRef } from 'react';
import styles from './Button.module.scss';

export interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant?: 'primary' | 'secondary';
}

export function Button({
  variant = 'secondary',
  type = 'button',
  className,
  ...props
}: ButtonProps) {
  return (
    <button type={type} className={clsx(styles.button, styles[variant], className)} {...props} />
  );
}
