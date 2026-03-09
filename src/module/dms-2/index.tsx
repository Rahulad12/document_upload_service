import Loader from '@/components/custom/common/loader';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useGetDocuments } from '@/services/hooks/use-documents';
import { AlertCircle } from 'lucide-react';
import { memo, useMemo } from 'react';
import DMS from './dms';
import { DocumentPreviewProvider } from '@/context/use-preview-documents-context';

const DocumentUploadLayout = memo(() => {
  /**
   * This hooks is used to get documents
   * @payload TransactionId, MerchantId, ProcessInstanceId
   */
  const {
    data: documentData,
    isLoading: documentLoading,
    error: documentError,
  } = useGetDocuments({
    TransactionId: 'string',
    MerchantId: 'string',
    ProcessInstanceId: 'string',
  });

  const requiredData = useMemo(
    () => documentData?.data || [],
    [documentData?.data]
  );

  if (documentError) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-linear-to-b from-slate-50 to-slate-100 p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Failed to Load Documents</AlertTitle>
          <AlertDescription>
            {documentError instanceof Error
              ? documentError.message
              : 'An error occurred while loading documents. Please try again.'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Loading state
  if (documentLoading) {
    return (
      <Loader
        className="h-screen w-full bg-primary/50 flex justify-center items-center"
        size={30}
        loaderClassName="w-20 h-20 text-primary-foreground"
      />
    );
  }

  return (
    <DocumentPreviewProvider>
      <DMS RequestedDocument={requiredData} />
    </DocumentPreviewProvider>
  );
});

export default DocumentUploadLayout;
