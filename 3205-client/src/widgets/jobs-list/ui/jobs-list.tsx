import { useEffect } from 'react';
import clsx from 'clsx';
import { JobStatusBadge, useJobsStore } from '@/entities/job';
import { formatDateTime } from '@/shared/lib/format-date';
import { Spinner } from '@/shared/ui';

export const JobsList = () => {
  const jobs = useJobsStore((state) => state.jobs);
  const jobsLoading = useJobsStore((state) => state.jobsLoading);
  const jobsError = useJobsStore((state) => state.jobsError);
  const activeJobId = useJobsStore((state) => state.activeJobId);
  const fetchJobs = useJobsStore((state) => state.fetchJobs);
  const selectJob = useJobsStore((state) => state.selectJob);

  useEffect(() => {
    void fetchJobs();
  }, [fetchJobs]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-700">Последние задания</h2>
        <button
          type="button"
          onClick={() => void fetchJobs()}
          disabled={jobsLoading}
          className="text-xs text-blue-600 hover:underline disabled:text-gray-400"
        >
          Обновить
        </button>
      </div>

      {jobsError && <p className="text-sm text-red-600">{jobsError}</p>}

      {jobsLoading && jobs.length === 0 && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Spinner /> Загрузка...
        </div>
      )}

      {!jobsLoading && jobs.length === 0 && !jobsError && (
        <p className="text-sm text-gray-500">Заданий пока нет</p>
      )}

      <ul className="flex flex-col gap-2">
        {jobs.map((job) => (
          <li key={job.id}>
            <button
              type="button"
              onClick={() => selectJob(job.id)}
              className={clsx(
                'w-full rounded-lg border px-3 py-2 text-left transition-colors',
                job.id === activeJobId
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50',
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="truncate font-mono text-xs text-gray-500">{job.id}</span>
                <JobStatusBadge status={job.status} />
              </div>
              <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
                <span>{formatDateTime(job.createdAt)}</span>
                <span>
                  {job.successCount}/{job.totalUrls} успешно
                  {job.errorCount > 0 ? `, ${job.errorCount} ошиб.` : ''}
                </span>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
