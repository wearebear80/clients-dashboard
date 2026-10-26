import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Toast, ToastViewport, type ToastTone } from './Toast.tsx';

export interface ToastOptions {
  tone?: ToastTone;
  title: ReactNode;
  description?: ReactNode;
  duration?: number;
}

export interface ToastApi {
  open: (options: ToastOptions) => string;
  close: (id: string) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

const DEFAULT_DURATION = 4000;

export interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<(ToastOptions & { id: string })[]>([]);
  const nextId = useRef(0);

  const close = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const open = useCallback((options: ToastOptions) => {
    const id = `toast-${(nextId.current += 1)}`;
    setToasts((current) => [...current, { ...options, id }]);
    return id;
  }, []);

  const api = useMemo(() => ({ open, close }), [open, close]);

  return (
    <ToastContext value={api}>
      {children}
      <ToastViewport>
        {toasts.map(({ id, duration = DEFAULT_DURATION, ...toast }) => (
          <TimedToast key={id} duration={duration} onClose={() => close(id)} {...toast} />
        ))}
      </ToastViewport>
    </ToastContext>
  );
}

interface TimedToastProps extends Omit<ToastOptions, 'duration'> {
  duration: number;
  onClose: () => void;
}

/** Closes itself after `duration`; the timer pauses while hovered or focused (WCAG 2.2.1). */
function TimedToast({ duration, onClose, ...toast }: TimedToastProps) {
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [paused, duration, onClose]);

  return (
    <Toast
      {...toast}
      onClose={onClose}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    />
  );
}

export function useToast(): ToastApi {
  const api = useContext(ToastContext);
  if (!api) throw new Error('useToast must be used inside <ToastProvider>');
  return api;
}
