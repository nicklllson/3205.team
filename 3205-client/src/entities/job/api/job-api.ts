import { api } from '@/shared/api/api-instance';
import type {
  TCancelJobResponse,
  TCreateJobResponse,
  TJobDetailDto,
  TJobSummaryDto,
} from '../model/types';

export const jobApi = {
  create: (urls: string[]) =>
    api<{ urls: string[] }, TCreateJobResponse>('/jobs', {
      method: 'POST',
      json: { urls },
    }),

  list: () => api<void, TJobSummaryDto[]>('/jobs'),

  getById: (id: string, signal?: AbortSignal) =>
    api<void, TJobDetailDto>(`/jobs/${id}`, { signal }),

  cancel: (id: string) =>
    api<void, TCancelJobResponse>(`/jobs/${id}`, { method: 'DELETE' }),
};
