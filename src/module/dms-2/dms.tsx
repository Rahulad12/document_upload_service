import DMSLayout from '@/components/custom/dms-2/dms-layout';
import DocumentDetail from '@/components/custom/dms-2/document-detail';
import { useDocument } from '@/hooks/use-document';
import type {
  DMSRequiredDocumentResponse,
} from '@/types/types';
import { memo, useCallback } from 'react';

interface Props {
  RequestedDocument: DMSRequiredDocumentResponse;
}
const DMS = memo(({ RequestedDocument }: Props) => {
  // Process documents with useDocument hook
  const {
    documents,
    activeDocument,
    activeIndex,
    handleSelectedDocumentNodeId,
    handleUpload,
    handleReplace,
    handleDelete,
    handlePreview,
    isDocumentPreviewLoading,
    documentUploadLoading,
  } = useDocument(RequestedDocument);

  const memoizedHandleSelectDocument = useCallback(
    (documentIndex: string) => handleSelectedDocumentNodeId(documentIndex),
    [handleSelectedDocumentNodeId]
  );

  const memoizedHandlePreview = useCallback(
    (documentIdx: string | undefined | null) => {
      handlePreview(documentIdx);
    },
    [handlePreview]
  );

  return (
    <DMSLayout
      enrollmentId="NMB-2024-8892"
      documents={documents}
      activeIndex={activeIndex}
      onSelectDocument={memoizedHandleSelectDocument}
    >
      <DocumentDetail
        activeDocument={activeDocument}
        onUpload={handleUpload}
        onReplace={handleReplace}
        onDelete={handleDelete}
        onPreviewExisting={memoizedHandlePreview}
        isLoadingFile={isDocumentPreviewLoading}
      />
    </DMSLayout>
  );
});

export default DMS;
