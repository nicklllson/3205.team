import type { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';
import { Spinner } from './spinner';

type TButtonVariant = 'primary' | 'secondary' | 'danger';

type TButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: TButtonVariant;
  loading?: boolean;
};

const VARIANT_CLASSES: Record<TButtonVariant, string> = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300',
  secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 disabled:text-gray-400',
  danger: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300',
};

export const Button = ({
  variant = 'primary',
  loading = false,
  disabled,
  className,
  children,
  ...props
}: TButtonProps) => (
  <button
    {...props}
    disabled={disabled || loading}
    className={clsx(
      'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed',
      VARIANT_CLASSES[variant],
      className,
    )}
  >
    {loading && <Spinner className="h-4 w-4" />}
    {children}
  </button>
);
