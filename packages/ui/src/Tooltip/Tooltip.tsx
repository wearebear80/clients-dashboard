import type { ComponentProps, ReactNode } from 'react';
import { Focusable, Tooltip as AriaTooltip, TooltipTrigger } from 'react-aria-components';
import styles from './Tooltip.module.scss';

export interface TooltipProps {
  content: ReactNode;
  /** The trigger: an element with an interactive role that forwards its ref, e.g. a `<button>`. */
  children: ComponentProps<typeof Focusable>['children'];
  placement?: 'top' | 'bottom' | 'start' | 'end';
  /** Hover delay in ms; keyboard focus opens it immediately. */
  delay?: number;
  defaultOpen?: boolean;
}

/** Short hint on hover or keyboard focus, linked to the trigger with `aria-describedby`. */
export function Tooltip({
  content,
  children,
  placement = 'top',
  delay = 300,
  defaultOpen,
}: TooltipProps) {
  return (
    <TooltipTrigger delay={delay} closeDelay={0} defaultOpen={defaultOpen}>
      <Focusable>{children}</Focusable>
      <AriaTooltip placement={placement} offset={6} className={styles.tooltip}>
        {content}
      </AriaTooltip>
    </TooltipTrigger>
  );
}
