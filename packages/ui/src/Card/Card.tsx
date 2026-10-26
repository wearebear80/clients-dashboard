import { clsx } from 'clsx';
import type { ComponentPropsWithoutRef, CSSProperties } from 'react';
import styles from './Card.module.scss';

type Space = number | string;

export interface CardPadding {
  p?: Space;
  px?: Space;
  py?: Space;
  pt?: Space;
  pr?: Space;
  pb?: Space;
  pl?: Space;
}

export type CardProps = ComponentPropsWithoutRef<'section'> & CardPadding;

/** The most specific side wins: `pt` over `py` over `p`. */
function paddingStyle({ p, px, py, pt, pr, pb, pl }: CardPadding): CSSProperties {
  return {
    paddingTop: pt ?? py ?? p,
    paddingRight: pr ?? px ?? p,
    paddingBottom: pb ?? py ?? p,
    paddingLeft: pl ?? px ?? p,
  };
}

export function Card({ p, px, py, pt, pr, pb, pl, className, style, ...props }: CardProps) {
  return (
    <section
      className={clsx(styles.card, className)}
      style={{ ...paddingStyle({ p, px, py, pt, pr, pb, pl }), ...style }}
      {...props}
    />
  );
}
