export type TJobStatus =
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'failed';

export type TUrlStatus =
  | 'pending'
  | 'in_progress'
  | 'success'
  | 'error'
  | 'cancelled';

export type TUrlResult = {
  url: string;
  status: TUrlStatus;
  httpStatus?: number;
  errorMessage?: string;
  startedAt?: Date;
  finishedAt?: Date;
};

export type TJob = {
  id: string;
  createdAt: Date;
  status: TJobStatus;
  urls: TUrlResult[];
  abortController: AbortController;
};

export const MAX_CONCURRENT_REQUESTS = 5;
export const MAX_DELAY_MS = 10_000;
export const REQUEST_TIMEOUT_MS = 15_000;
