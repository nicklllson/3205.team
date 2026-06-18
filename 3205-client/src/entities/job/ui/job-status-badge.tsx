import { Badge, type TBadgeColor } from '@/shared/ui';
import { JOB_STATUS_LABEL } from '../model/constants';
import type { TJobStatus } from '../model/types';

const COLOR_MAP: Record<TJobStatus, TBadgeColor> = {
  pending: 'gray',
  in_progress: 'blue',
  completed: 'green',
  cancelled: 'amber',
  failed: 'red',
};

type TJobStatusBadgeProps = {
  status: TJobStatus;
};

export const JobStatusBadge = ({ status }: TJobStatusBadgeProps) => (
  <Badge color={COLOR_MAP[status]}>{JOB_STATUS_LABEL[status]}</Badge>
);
