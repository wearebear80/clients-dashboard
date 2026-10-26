import { clsx } from 'clsx';
import type { CSSProperties } from 'react';
import styles from './Skeleton.module.scss';

export interface SkeletonProps {
  width?: CSSProperties['width'];
  height: CSSProperties['height'];
  animated?: boolean;
  className?: string;
}

export function Skeleton({ width = '100%', height, animated = true, className }: SkeletonProps) {
  return (
    <div
      className={clsx(styles.skeleton, animated && styles.animated, className)}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}
