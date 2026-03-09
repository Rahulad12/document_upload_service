import type {
  DMSRequiredDocumentResponse,
  DocumentImageRequestType,
  DocumentImageResponse,
  DocumentRequestType,
  UploadDocumentRequestType,
} from '@/types/types';
import { getDocumentImage, getDocumentsDetails, uploadDocuments } from '../apis/documet-service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Axios, AxiosResponse } from 'axios';
import { toast } from 'sonner';

export const useGetDocuments = (data: DocumentRequestType) => {
  return useQuery<AxiosResponse<DMSRequiredDocumentResponse>, Axios>({
    // queryFn: () => getDocumentsDetails(),
    queryFn: () => getDocumentsDetails(data),
    queryKey: [
      'documents',
      data.ProcessInstanceId,
      data.MerchantId,
      data.TransactionId,
    ],
    enabled: !!data?.ProcessInstanceId && !!data?.MerchantId,
  });
};

export const useGetDocumentImage = () => {
  return useMutation({
    mutationKey: ['document-image'],
    mutationFn: async (data: DocumentImageRequestType): Promise<AxiosResponse<DocumentImageResponse, {}>> => {
      const response = await getDocumentImage(data);
      return response;
    }
  });
};

export const useUploadDocuments = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['upload-documents'],
    mutationFn: async (data: UploadDocumentRequestType): Promise<AxiosResponse<any, {}>> => {
      const response = await uploadDocuments(data);
      return response;
    },
    onSuccess: (data) => {
      toast.success(data?.data?.message || 'Documents uploaded successfully')
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
    onError: (error: any) => {
      console.log(error)
      toast.error(error?.data?.message || 'Failed to upload documents')
    }
  });
};