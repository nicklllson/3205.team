import { useJobsStore } from '@/entities/job';
import { Button } from '@/shared/ui';
import { type TJobCreateFormOutput } from '../model/schema';
import { useJobCreation } from '../lib/use-job-creation';

export const JobCreateForm = () => {
  const createJob = useJobsStore((state) => state.createJob);
  const createLoading = useJobsStore((state) => state.createLoading);
  const createError = useJobsStore((state) => state.createError);

  const { errors, handleSubmit, register, urlsCount } = useJobCreation();

  const onSubmit = async (data: TJobCreateFormOutput) => {
    await createJob(data.urlsText);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <label htmlFor="urls" className="text-sm font-medium text-gray-700">
        Список URL (каждый — с новой строки)
      </label>
      <textarea
        id="urls"
        {...register('urlsText')}
        placeholder={'https://example.com\nhttps://example.org'}
        rows={8}
        className="w-full resize-y rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm text-gray-900 shadow-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs text-gray-500">
          {urlsCount > 0
            ? `Найдено URL: ${urlsCount}`
            : 'Введите хотя бы один URL'}
        </span>
        <Button type="submit" loading={createLoading}>
          Запустить проверку
        </Button>
      </div>
      {errors.urlsText && (
        <p className="text-sm text-red-600">{errors.urlsText.message}</p>
      )}
      {createError && <p className="text-sm text-red-600">{createError}</p>}
    </form>
  );
};
