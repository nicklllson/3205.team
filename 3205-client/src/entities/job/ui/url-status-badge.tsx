import { Badge, type TBadgeColor } from '@/shared/ui';
import { URL_STATUS_LABEL } from '../model/constants';
import type { TUrlStatus } from '../model/types';

const COLOR_MAP: Record<TUrlStatus, TBadgeColor> = {
  pending: 'gray',
  in_progress: 'blue',
  success: 'green',
  error: 'red',
  cancelled: 'amber',
};

type TUrlStatusBadgeProps = {
  status: TUrlStatus;
};

export const UrlStatusBadge = ({ status }: TUrlStatusBadgeProps) => (
  <Badge color={COLOR_MAP[status]}>{URL_STATUS_LABEL[status]}</Badge>
);
