import { FileText } from 'lucide-react';
import DocumentUploader from './document-uploader';
import { Badge } from '@/components/ui/badge';
import DocumentPreview from '../common/document-preview';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { ExistingDocumentCard } from './existing-document-card';
import { Activity, useCallback, useState, type Dispatch, type SetStateAction } from 'react';
import type { DocumentNode } from '@/hooks/use-document';
import type { FileWithPreview } from '@/hooks/use-file-upload';
import { Button } from '@/components/ui/button';
import { DOCUMENT_SIZE_LIMIT } from '@/runtime-config';

// Shape of a pending (pre-upload) file preview
interface PreUploadPreview {
  url: string;
  fileType: 'image' | 'pdf' | 'unknown';
  fileName: string;
}

interface DocumentDetailProps {
  activeDocument: DocumentNode | null;
  onUpload: (files: any[], label?: string) => void;
  onReplace: () => void;
  onDelete?: () => void;
  onPreviewExisting?: (documentIndex: string | undefined | null) => void;
  isLoadingFile?: boolean;
}

const DocumentDetail = ({
  activeDocument,
  onReplace,
  onUpload,
  isLoadingFile,
  onDelete,
  onPreviewExisting,
}: DocumentDetailProps) => {
  const [preUploadPreview, setPreUploadPreview] =
    useState<PreUploadPreview | null>(null);
  const [toggleDetails, setToggleDetails] = useState(false);

  const handlePreviewFile = useCallback((fileWithPreview: FileWithPreview) => {
    const file = fileWithPreview.file as File;
    if (!file) return;

    const url =
      fileWithPreview.preview ||
      (file instanceof File ? URL.createObjectURL(file) : '');

    const mime = file instanceof File ? file.type : '';
    const fileType: PreUploadPreview['fileType'] = mime.startsWith('image/')
      ? 'image'
      : mime === 'application/pdf'
        ? 'pdf'
        : 'unknown';

    setPreUploadPreview({
      url,
      fileType,
      fileName: file instanceof File ? file.name : 'Document',
    });
  }, []);

  // Memoize callback handlers
  const handleAdd = useCallback(
    (files: any[]) => {
      onUpload(files);
      setPreUploadPreview(null);
    },
    [onUpload]
  );

  const handleUpdate = useCallback(
    (files: any[]) => {
      onUpload(files);
      setPreUploadPreview(null);
    },
    [onUpload]
  );

  const handleDeleteClick = useCallback(() => {
    if (onDelete) {
      onDelete();
    }
  }, [onDelete]);

  const handlePreviewExisting = useCallback(() => {
    if (onPreviewExisting && activeDocument?.documentIndexId) {
      // Clear any lingering pre-upload preview when switching to existing
      setPreUploadPreview(null);
      onPreviewExisting(activeDocument.documentIndexId);
    }
  }, [onPreviewExisting, activeDocument?.documentIndexId]);

  const documentSizeLimit = DOCUMENT_SIZE_LIMIT && DOCUMENT_SIZE_LIMIT * 1024 * 1024;

  if (!activeDocument) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-screen p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-200 flex items-center justify-center">
            <FileText className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">
            No Document Selected
          </h3>
          <p className="text-slate-500 text-sm">
            Select a document from the list or upload a new one to get started.
          </p>
        </div>
      </div>
    );
  }

  // Extract permission flags
  const allowMultiple = activeDocument?.allowMultiple ?? true;
  const doesExist = activeDocument?.doesExist ?? false;

  const hasUploadedFile =
    activeDocument?.file !== undefined && activeDocument?.file !== null;
  const hasPreviewData = activeDocument?.previewUrl !== undefined;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 h-full bg-linear-to-b from-slate-50 to-slate-100">

      {/* Left Panel  Header + Upload Section */}
      <Activity mode={!toggleDetails ? 'visible' : 'hidden'}>
        <div className={cn(
          "lg:col-span-1 flex flex-col h-full overflow-auto bg-white border-r border-slate-200",
        )}>

          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-white shadow-sm sticky top-0 z-10">
            <div className="flex-1 min-w-0 flex gap-2">
              <h2 className="text-base font-bold text-slate-800 capitalize truncate">
                {activeDocument?.label}
              </h2>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                {activeDocument?.isRequired && (
                  <Badge
                    variant="outline"
                    className="text-xs bg-amber-500 text-primary-foreground"
                  >
                    Required
                  </Badge>
                )}
              </div>
            </div>
          </div>
          {/* Document Upload/Details Section */}
          <div className="flex-1 p-4 space-y-6 overflow-auto">
            {/* Existing Document Card  this will only show if does exist is true */}
            {doesExist ? (
              <ExistingDocumentCard
                key={activeDocument.id}
                document={activeDocument}
                onPreview={handlePreviewExisting}
                onAdd={handleAdd}
                onUpdate={handleUpdate}
                onDelete={handleDeleteClick}
                isLoadingFile={isLoadingFile}
                onPreviewFile={handlePreviewFile}
              />
            ) : (
              /* Regular Upload Flow this will only show if document doesn't exist */
              <div className="bg-white border border-slate-200 rounded-xl p-5">
                {!hasUploadedFile && !hasPreviewData && (
                  <div className="space-y-4">
                    <DocumentUploader
                      key={activeDocument.id}
                      maxSize={documentSizeLimit}
                      onFilesChange={onUpload}
                      onReplace={onReplace}
                      onDelete={onDelete}
                      onPreviewFile={handlePreviewFile}
                      className="bg-slate-50"
                      defaultLabel={activeDocument?.label}
                      activeDocument={activeDocument}
                      accept={activeDocument?.allowedFileExtensions?.map(ext => `.${ext}`).join(', ') || ''}
                    />

                    <div className="text-xs text-slate-500 space-y-2">
                      <div className="flex items-center justify-between">
                        <span>Maximum file size:</span>
                        <span className="font-medium">5 MB</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Allowed formats:</span>
                        <span className="font-medium">
                          {activeDocument.allowedFileExtensions?.join(', ') ||
                            'PDF, JPEG, PNG'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Multiple files:</span>
                        <span
                          className={cn(
                            'font-medium',
                            allowMultiple ? 'text-green-600' : 'text-red-600'
                          )}
                        >
                          {allowMultiple ? 'Allowed' : 'Not allowed'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Activity>


      {/* Right Panel  Document Preview */}
      <div className={cn(
        "lg:col-span-3 flex flex-col h-screen overflow-auto",
        toggleDetails && "lg:col-span-4"
      )}>
        {isLoadingFile ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Skeleton className="h-6 w-48 mx-auto mb-2 bg-gray-200" />
              <Skeleton className="h-4 w-32 mx-auto bg-gray-200" />
            </div>
          </div>
        ) : preUploadPreview ? (
          <PreUploadPreviewPanel preview={preUploadPreview} setToggleDetails={setToggleDetails} toggleDetails={toggleDetails} />
        ) : (
          <DocumentPreview document={activeDocument} setToggleDetails={setToggleDetails} toggleDetails={toggleDetails} />
        )}
      </div>
    </div>
  );
};

// ─── Pre-Upload Preview Panel ─────────────────────────────────────────────────
function PreUploadPreviewPanel({ preview, setToggleDetails, toggleDetails }:
  {
    preview: PreUploadPreview,
    setToggleDetails: Dispatch<SetStateAction<boolean>>,
    toggleDetails: boolean
  }
) {
  const { url, fileType, fileName } = preview;

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-2 border-b border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-slate-800 truncate">
            Pre-Upload Preview
          </h3>
          <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 border border-amber-200">
            Not yet uploaded
          </span>
        </div>
        <p className="text-xs text-slate-500 truncate max-w-56">{fileName}</p>
        <Button onClick={() => setToggleDetails((prev: boolean) => !prev)} variant="outline" size={"sm"}>
          {toggleDetails ? 'Collapse page' : 'Expand page'}
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {fileType === 'image' ? (
          <img
            src={url}
            alt={fileName}
            className="w-full h-full object-contain bg-slate-50 p-4"
          />
        ) : fileType === 'pdf' ? (
          <iframe
            src={url}
            className="absolute inset-0 w-full h-full border-0"
            title={fileName}
            style={{ position: 'relative', height: '100%', width: '100%' }}
          />
        ) : (
          // Generic fallback: try iframe
          <iframe
            src={url}
            className="w-full h-full border-0"
            title={fileName}
          />
        )}
      </div>
    </div >
  );
}

export default DocumentDetail;
