import type { ReactNode } from 'react';
import clsx from 'clsx';

export type TBadgeColor = 'gray' | 'blue' | 'green' | 'red' | 'amber';

const COLOR_CLASSES: Record<TBadgeColor, string> = {
  gray: 'bg-gray-100 text-gray-700 ring-gray-200',
  blue: 'bg-blue-50 text-blue-700 ring-blue-200',
  green: 'bg-green-50 text-green-700 ring-green-200',
  red: 'bg-red-50 text-red-700 ring-red-200',
  amber: 'bg-amber-50 text-amber-700 ring-amber-200',
};

type TBadgeProps = {
  color?: TBadgeColor;
  children: ReactNode;
};

export const Badge = ({ color = 'gray', children }: TBadgeProps) => (
  <span
    className={clsx(
      'inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset',
      COLOR_CLASSES[color],
    )}
  >
    {children}
  </span>
);
