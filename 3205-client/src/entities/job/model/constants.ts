import type { TJobStatus, TUrlStatus } from './types';

export const POLL_INTERVAL_MS = 1500;

export const TERMINAL_JOB_STATUSES: TJobStatus[] = [
  'completed',
  'cancelled',
  'failed',
];

export const TERMINAL_URL_STATUSES: TUrlStatus[] = [
  'success',
  'error',
  'cancelled',
];

export const JOB_STATUS_LABEL: Record<TJobStatus, string> = {
  pending: 'В очереди',
  in_progress: 'В процессе',
  completed: 'Завершено',
  cancelled: 'Отменено',
  failed: 'Ошибка',
};

export const URL_STATUS_LABEL: Record<TUrlStatus, string> = {
  pending: 'В очереди',
  in_progress: 'Проверяется',
  success: 'Успешно',
  error: 'Ошибка',
  cancelled: 'Отменено',
};
