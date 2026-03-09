// hooks/use-document-preview-context.tsx or contexts/DocumentPreviewContext.tsx
import { createContext, useState, useCallback } from 'react';
import { toast } from 'sonner';
import type { FileWithPreview } from '@/hooks/use-file-upload';
// import type { useDocument } from '@/hooks/use-document';

interface DocumentPreviewContextType {
  previewUrl: string | undefined;
  setPreviewUrl: (url: string | undefined) => void;
  handlePreview: (documentIndex: string | null | undefined) => Promise<void>;
  handleOnUploadPreview: (files: FileWithPreview[], index: number) => void;
  clearPreview: () => void;
  contentType: string | undefined;
}

const DocumentPreviewContext = createContext<
  DocumentPreviewContextType | undefined
>(undefined);

interface DocumentPreviewProviderProps {
  children: React.ReactNode;
}
const DocumentPreviewProvider = ({
  children,
}: DocumentPreviewProviderProps) => {
  const [previewUrl, setPreviewUrl] = useState<string>();
  const [contentType, setContentType] = useState<string>();


  const handlePreview = async (documentIndex: string | null | undefined) => {
    try {
      console.log(documentIndex, 'documentIndex');
    } catch (error) {
      console.error('Preview error:', error);
      toast.error('Failed to preview document.');
      // Clear preview on error
      setPreviewUrl(undefined);
    }
  };

  const handleOnUploadPreview = useCallback(
    (files: FileWithPreview[], index: number) => {
      const file = files[index]?.file as File;
      console.log(file, 'sdfjhhlsjdfl');
      if (!file) return;
      setContentType(file.type);
      setPreviewUrl(files[index]?.preview as string);
    },
    []
  );

  const clearPreview = useCallback(() => {
    setPreviewUrl(undefined);
  }, []);

  const value = {
    previewUrl,
    setPreviewUrl,
    handlePreview,
    handleOnUploadPreview,
    clearPreview,
    contentType,
  };

  return (
    <DocumentPreviewContext.Provider value={value}>
      {children}
    </DocumentPreviewContext.Provider>
  );
};

export { DocumentPreviewProvider, DocumentPreviewContext };
