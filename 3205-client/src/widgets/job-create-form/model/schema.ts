import { z } from 'zod';

const parseUrls = (raw: string): string[] =>
  raw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

export const jobCreateFormSchema = z.object({
  urlsText: z
    .string('URL должен быть строкой')
    .refine((raw) => parseUrls(raw).length > 0, 'Введите хотя бы один URL')
    .refine(
      (raw) => parseUrls(raw).every((url) => z.url().safeParse(url).success),
      'Некорректный URL',
    )
    .transform(parseUrls),
});

export type TJobCreateFormInput = z.input<typeof jobCreateFormSchema>;
export type TJobCreateFormOutput = z.output<typeof jobCreateFormSchema>;
