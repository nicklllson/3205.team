import { TJobStatus, TUrlStatus } from '../types/jobs.types';

export type TCreateJobResponse = {
  jobId: string;
};

export type TJobSummaryDto = {
  id: string;
  createdAt: string;
  status: TJobStatus;
  totalUrls: number;
  successCount: number;
  errorCount: number;
};

export type TUrlResultDto = {
  url: string;
  status: TUrlStatus;
  httpStatus: number | null;
  errorMessage: string | null;
  startedAt: string | null;
  finishedAt: string | null;
  durationMs: number | null;
};

export type TJobDetailDto = {
  id: string;
  createdAt: string;
  status: TJobStatus;
  urls: TUrlResultDto[];
};

export type TCancelJobResponse = {
  id: string;
  status: TJobStatus;
};
