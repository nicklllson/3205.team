import {
  JobStatusBadge,
  TERMINAL_JOB_STATUSES,
  TERMINAL_URL_STATUSES,
  UrlStatusBadge,
  useJobsStore,
} from '@/entities/job';
import { formatDateTime } from '@/shared/lib/format-date';
import { Button, Spinner } from '@/shared/ui';

export const JobDetails = () => {
  const activeJobId = useJobsStore((state) => state.activeJobId);
  const activeJob = useJobsStore((state) => state.activeJob);
  const activeJobLoading = useJobsStore((state) => state.activeJobLoading);
  const activeJobError = useJobsStore((state) => state.activeJobError);
  const cancelLoading = useJobsStore((state) => state.cancelLoading);
  const cancelError = useJobsStore((state) => state.cancelError);
  const cancelActiveJob = useJobsStore((state) => state.cancelActiveJob);

  if (!activeJobId) {
    return (
      <div className="flex h-full min-h-48 items-center justify-center rounded-lg border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
        Выберите задание из списка или запустите новую проверку
      </div>
    );
  }

  if (activeJobLoading && !activeJob) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Spinner /> Загрузка задания...
      </div>
    );
  }

  if (activeJobError && !activeJob) {
    return <p className="text-sm text-red-600">{activeJobError}</p>;
  }

  if (!activeJob) return null;

  const total = activeJob.urls.length;
  const processed = activeJob.urls.filter((url) =>
    TERMINAL_URL_STATUSES.includes(url.status),
  ).length;
  const progressPercent = total === 0 ? 0 : Math.round((processed / total) * 100);
  const isTerminal = TERMINAL_JOB_STATUSES.includes(activeJob.status);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="font-mono text-xs text-gray-500">{activeJob.id}</p>
          <p className="text-xs text-gray-500">{formatDateTime(activeJob.createdAt)}</p>
        </div>
        <div className="flex items-center gap-2">
          <JobStatusBadge status={activeJob.status} />
          {!isTerminal && (
            <Button
              variant="danger"
              loading={cancelLoading}
              onClick={() => void cancelActiveJob()}
            >
              Отменить задание
            </Button>
          )}
        </div>
      </div>

      {activeJobError && <p className="text-sm text-red-600">{activeJobError}</p>}
      {cancelError && <p className="text-sm text-red-600">{cancelError}</p>}

      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            {processed} из {total} обработано
          </span>
          <span>{progressPercent}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-blue-500 transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <ul className="flex flex-col divide-y divide-gray-100 overflow-hidden rounded-lg border border-gray-200">
        {activeJob.urls.map((url) => (
          <li
            key={url.url}
            className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 text-sm"
          >
            <span className="min-w-0 flex-1 truncate" title={url.url}>
              {url.url}
            </span>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              {url.httpStatus != null && <span className="font-mono">{url.httpStatus}</span>}
              {url.errorMessage && <span className="text-red-600">{url.errorMessage}</span>}
              <UrlStatusBadge status={url.status} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
