// hooks/use-document-preview.ts
import { DocumentPreviewContext } from '@/context/use-preview-documents-context';
import { useContext } from 'react';

export function useDocumentPreview() {
  const context = useContext(DocumentPreviewContext);

  if (!context) {
    throw new Error('useDocumentPreview must be used within DocumentPreviewProvider');
  }

  return context;
}