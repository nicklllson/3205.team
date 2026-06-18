import { JobCreateForm } from '@/widgets/job-create-form';
import { JobDetails } from '@/widgets/job-details';
import { JobsList } from '@/widgets/jobs-list';

export const JobsPage = () => (
  <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-4 py-8">
    <header>
      <h1 className="text-2xl font-semibold text-gray-900">Проверка URL</h1>
      <p className="text-sm text-gray-500">
        Запустите массовую проверку доступности ссылок и следите за статусом в реальном времени
      </p>
    </header>

    <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <JobCreateForm />
    </section>

    <div className="grid grid-cols-1 gap-6 md:grid-cols-[320px_1fr]">
      <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <JobsList />
      </section>
      <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <JobDetails />
      </section>
    </div>
  </div>
);
