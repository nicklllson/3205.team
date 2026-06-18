import { useForm } from 'react-hook-form';
import {
  jobCreateFormSchema,
  type TJobCreateFormInput,
  type TJobCreateFormOutput,
} from '../model/schema';
import { zodResolver } from '@hookform/resolvers/zod';

export const useJobCreation = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TJobCreateFormInput, unknown, TJobCreateFormOutput>({
    resolver: zodResolver(jobCreateFormSchema),
    defaultValues: { urlsText: '' },
  });

  const urlsCount = watch('urlsText')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean).length;

  return { urlsCount, register, handleSubmit, errors };
};
