import styles from './Avatar.module.scss';

export interface AvatarProps {
  name: string;
  src?: string;
}

const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

export function Avatar({ name, src }: AvatarProps) {
  return src ? (
    <img className={styles.avatar} src={src} alt="" />
  ) : (
    <span className={styles.avatar} aria-hidden="true">
      {initialsOf(name)}
    </span>
  );
}
