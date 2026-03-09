import { DOCUMENT_SIZE_LIMIT } from '@/runtime-config';
import { z } from 'zod';

const fileSize: number = DOCUMENT_SIZE_LIMIT || 5;
export const documentUploadSchema = z
  .object({
    file: z.instanceof(FileList).refine((file: FileList) => file.length > 0, {
      message: 'Please select a file',
    }),
  })
  .refine((data) => data.file[0].size <= fileSize, {
    message: 'File size exceeds the limit',
  });

export type DocumentUploadSchema = z.infer<typeof documentUploadSchema>;
