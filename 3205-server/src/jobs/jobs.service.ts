import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  TJob,
  MAX_CONCURRENT_REQUESTS,
  MAX_DELAY_MS,
  REQUEST_TIMEOUT_MS,
  TUrlResult,
} from './types/jobs.types';
import {
  TCancelJobResponse,
  TCreateJobResponse,
  TJobDetailDto,
  TJobSummaryDto,
  TUrlResultDto,
} from './dto/create-job-response.dto';

@Injectable()
export class JobsService {
  private readonly logger = new Logger(JobsService.name);
  private readonly jobs = new Map<string, TJob>();

  create(urls: string[]): TCreateJobResponse {
    const job: TJob = {
      id: randomUUID(),
      createdAt: new Date(),
      status: 'pending',
      urls: urls.map((url) => ({ url, status: 'pending' })),
      abortController: new AbortController(),
    };

    this.jobs.set(job.id, job);

    void this.processJob(job.id);

    return { jobId: job.id };
  }

  findAll(): TJobSummaryDto[] {
    return [...this.jobs.values()].map((job) => this.toSummary(job));
  }

  findOne(id: string): TJobDetailDto {
    const job = this.jobs.get(id);
    if (!job) {
      throw new NotFoundException(`Задание ${id} не найдено`);
    }
    return this.toDetail(job);
  }

  cancel(id: string): TCancelJobResponse {
    const job = this.jobs.get(id);
    if (!job) {
      throw new NotFoundException(`Задание ${id} не найдено`);
    }

    const terminal = ['completed', 'cancelled', 'failed'];

    if (!terminal.includes(job.status)) {
      job.abortController.abort();
      job.status = 'cancelled';
      this.logger.log(`Задание ${id} отменено`);
    }

    return { id: job.id, status: job.status };
  }

  private async processJob(jobId: string): Promise<void> {
    const job = this.jobs.get(jobId);
    if (!job) return;

    const { signal } = job.abortController;

    if (signal.aborted) {
      this.finalize(job);
      return;
    }

    job.status = 'in_progress';

    try {
      let cursor = 0;
      const workerCount = Math.min(MAX_CONCURRENT_REQUESTS, job.urls.length);

      const worker = async (): Promise<void> => {
        while (true) {
          if (signal.aborted) return;
          const index = cursor++;
          if (index >= job.urls.length) return;
          await this.processUrl(job.urls[index], signal);
        }
      };

      await Promise.all(Array.from({ length: workerCount }, () => worker()));
      this.finalize(job);
    } catch (err) {
      this.logger.error(`Задание ${jobId} упало: ${this.errToString(err)}`);
      job.status = 'failed';
    }
  }

  private async processUrl(
    result: TUrlResult,
    jobSignal: AbortSignal,
  ): Promise<void> {
    if (jobSignal.aborted) {
      result.status = 'cancelled';
      return;
    }

    result.status = 'in_progress';
    result.startedAt = new Date();

    try {
      const fetchSignal = AbortSignal.any([
        jobSignal,
        AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      ]);

      const response = await fetch(result.url, {
        method: 'HEAD',
        signal: fetchSignal,
      });

      await this.delay(this.randomDelayMs(), jobSignal);

      result.httpStatus = response.status;
      if (response.ok) {
        result.status = 'success';
      } else {
        result.status = 'error';
        result.errorMessage = `HTTP ${response.status}`;
      }
    } catch (err) {
      if (jobSignal.aborted) {
        result.status = 'cancelled';
      } else {
        result.status = 'error';
        result.errorMessage = this.errToString(err);
      }
    } finally {
      result.finishedAt = new Date();
    }
  }

  private finalize(job: TJob): void {
    if (job.abortController.signal.aborted) {
      for (const url of job.urls) {
        if (url.status === 'pending' || url.status === 'in_progress') {
          url.status = 'cancelled';
        }
      }
      job.status = 'cancelled';
    } else {
      job.status = 'completed';
    }
  }

  private randomDelayMs(): number {
    return Math.floor(Math.random() * (MAX_DELAY_MS + 1));
  }

  private delay(ms: number, signal: AbortSignal): Promise<void> {
    return new Promise((resolve, reject) => {
      if (signal.aborted) {
        reject(new DOMException('Aborted', 'AbortError'));
        return;
      }
      const timer = setTimeout(() => {
        signal.removeEventListener('abort', onAbort);
        resolve();
      }, ms);
      const onAbort = () => {
        clearTimeout(timer);
        reject(new DOMException('Aborted', 'AbortError'));
      };
      signal.addEventListener('abort', onAbort, { once: true });
    });
  }

  private errToString(err: unknown): string {
    return err instanceof Error ? err.message : String(err);
  }

  private toSummary(job: TJob): TJobSummaryDto {
    let successCount = 0;
    let errorCount = 0;
    for (const url of job.urls) {
      if (url.status === 'success') successCount++;
      else if (url.status === 'error') errorCount++;
    }

    return {
      id: job.id,
      createdAt: job.createdAt.toISOString(),
      status: job.status,
      totalUrls: job.urls.length,
      successCount,
      errorCount,
    };
  }

  private toDetail(job: TJob): TJobDetailDto {
    return {
      id: job.id,
      createdAt: job.createdAt.toISOString(),
      status: job.status,
      urls: job.urls.map((url) => this.toUrlDto(url)),
    };
  }

  private toUrlDto(url: TUrlResult): TUrlResultDto {
    const durationMs =
      url.startedAt && url.finishedAt
        ? url.finishedAt.getTime() - url.startedAt.getTime()
        : null;

    return {
      url: url.url,
      status: url.status,
      httpStatus: url.httpStatus ?? null,
      errorMessage: url.errorMessage ?? null,
      startedAt: url.startedAt?.toISOString() ?? null,
      finishedAt: url.finishedAt?.toISOString() ?? null,
      durationMs,
    };
  }
}
