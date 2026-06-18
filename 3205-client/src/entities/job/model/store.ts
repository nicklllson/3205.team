import { create } from 'zustand';
import { jobApi } from '../api/job-api';
import { POLL_INTERVAL_MS, TERMINAL_JOB_STATUSES } from './constants';
import type { TJobDetailDto, TJobSummaryDto } from './types';

type TJobsState = {
  jobs: TJobSummaryDto[];
  jobsLoading: boolean;
  jobsError: string | null;

  activeJobId: string | null;
  activeJob: TJobDetailDto | null;
  activeJobLoading: boolean;
  activeJobError: string | null;

  cancelLoading: boolean;
  cancelError: string | null;

  createLoading: boolean;
  createError: string | null;
};

type TJobsActions = {
  fetchJobs: () => Promise<void>;
  selectJob: (id: string) => void;
  createJob: (urls: string[]) => Promise<void>;
  cancelActiveJob: () => Promise<void>;
};

const getErrorMessage = (error: unknown, fallback: string): string =>
  error instanceof Error ? error.message : fallback;

let pollAbortController: AbortController | null = null;
let pollTimeoutId: ReturnType<typeof setTimeout> | null = null;
let pollingJobId: string | null = null;

const stopPolling = (): void => {
  if (pollTimeoutId !== null) clearTimeout(pollTimeoutId);
  pollTimeoutId = null;
  pollAbortController?.abort();
  pollAbortController = null;
  pollingJobId = null;
};

export const useJobsStore = create<TJobsState & TJobsActions>((set, get) => {
  const pollActiveJob = async (jobId: string): Promise<void> => {
    if (pollingJobId !== jobId) return;

    const abortController = new AbortController();
    pollAbortController = abortController;

    try {
      const detail = await jobApi.getById(jobId, abortController.signal);

      if (pollingJobId !== jobId || get().activeJobId !== jobId) return;

      set({ activeJob: detail, activeJobLoading: false, activeJobError: null });

      if (TERMINAL_JOB_STATUSES.includes(detail.status)) {
        stopPolling();
        void get().fetchJobs();
        return;
      }

      pollTimeoutId = setTimeout(
        () => void pollActiveJob(jobId),
        POLL_INTERVAL_MS,
      );
    } catch (error) {
      if (abortController.signal.aborted) return;
      if (pollingJobId !== jobId || get().activeJobId !== jobId) return;

      set({
        activeJobLoading: false,
        activeJobError: getErrorMessage(
          error,
          'Не удалось получить статус задания',
        ),
      });
      pollTimeoutId = setTimeout(
        () => void pollActiveJob(jobId),
        POLL_INTERVAL_MS,
      );
    }
  };

  const startPolling = (jobId: string): void => {
    stopPolling();
    pollingJobId = jobId;
    void pollActiveJob(jobId);
  };

  return {
    jobs: [],
    jobsLoading: false,
    jobsError: null,

    activeJobId: null,
    activeJob: null,
    activeJobLoading: false,
    activeJobError: null,

    cancelLoading: false,
    cancelError: null,

    createLoading: false,
    createError: null,

    fetchJobs: async () => {
      set({ jobsLoading: true, jobsError: null });
      try {
        const jobs = await jobApi.list();
        set({ jobs, jobsLoading: false });
      } catch (error) {
        set({
          jobsLoading: false,
          jobsError: getErrorMessage(
            error,
            'Не удалось загрузить список заданий',
          ),
        });
      }
    },

    selectJob: (id) => {
      if (get().activeJobId === id) return;

      stopPolling();
      set({
        activeJobId: id,
        activeJob: null,
        activeJobLoading: true,
        activeJobError: null,
        cancelError: null,
      });
      startPolling(id);
    },

    createJob: async (urls) => {
      set({ createLoading: true, createError: null });
      try {
        const { jobId } = await jobApi.create(urls);
        set({ createLoading: false });

        stopPolling();
        set({
          activeJobId: jobId,
          activeJob: null,
          activeJobLoading: true,
          activeJobError: null,
          cancelError: null,
        });
        startPolling(jobId);

        void get().fetchJobs();
      } catch (error) {
        set({
          createLoading: false,
          createError: getErrorMessage(error, 'Не удалось создать задание'),
        });
      }
    },

    cancelActiveJob: async () => {
      const jobId = get().activeJobId;
      if (!jobId) return;

      set({ cancelLoading: true, cancelError: null });
      try {
        await jobApi.cancel(jobId);
        set({ cancelLoading: false });

        if (get().activeJobId === jobId) {
          startPolling(jobId);
        }
        void get().fetchJobs();
      } catch (error) {
        set({
          cancelLoading: false,
          cancelError: getErrorMessage(error, 'Не удалось отменить задание'),
        });
      }
    },
  };
});
