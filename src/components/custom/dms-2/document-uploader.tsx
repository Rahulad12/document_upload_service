import { useState, useCallback, useMemo } from 'react';
import {
  formatBytes,
  useFileUpload,
  type FileWithPreview,
} from '@/hooks/use-file-upload';
import {
  TriangleAlert,
  Upload,
  Eye,
  FileText,
  Image as ImageIcon,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { DocumentNode } from '@/hooks/use-document';

interface FileUploadItem extends FileWithPreview {
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
  documentLabel?: string;
  uploadedAt?: Date;
}

interface DocumentUploaderProps {
  maxFiles?: number;
  maxSize?: number;
  accept?: string;
  className?: string;
  onFilesChange?: (files: FileWithPreview[], label?: string) => void;
  onReplace?: (fileId: string) => void;
  onDelete?: (fileId: string) => void;
  /** Called when user clicks the Eye button on a pending file — passes the full FileWithPreview so the caller can build a preview URL */
  onPreviewFile?: (file: FileWithPreview) => void;
  simulateUpload?: boolean;
  defaultLabel?: string;
  activeDocument?: DocumentNode;
}

const DocumentUploader = ({
  maxFiles = 10,
  maxSize = 5 * 1024 * 1024,
  accept = '',
  className,
  onFilesChange,
  onPreviewFile,
  defaultLabel,
  activeDocument,
}: DocumentUploaderProps) => {
  console.log("accept", accept);
  const [uploadFiles, setUploadFiles] = useState<FileUploadItem[]>([]);
  const [pendingFiles, setPendingFiles] = useState<FileUploadItem[]>([]);

  const permissions = useMemo(
    () => ({
      allowMultiple: activeDocument?.allowMultiple ?? true,
      allowUpdate: activeDocument?.allowUpdate ?? true,
      allowDelete: activeDocument?.allowDelete ?? true,
    }),
    [
      activeDocument?.allowMultiple,
      activeDocument?.allowUpdate,
      activeDocument?.allowDelete,
    ]
  );

  const { allowMultiple } = permissions;
  const hasFiles = uploadFiles.length > 0;
  const hasPendingFiles = pendingFiles.length > 0;

  // Determine if upload is disabled
  const isUploadDisabled = useMemo(
    () => hasFiles && !allowMultiple && uploadFiles.length >= 1,
    [hasFiles, allowMultiple, uploadFiles.length]
  );

  // Memoized helper functions
  const getFileIcon = useCallback((file: FileUploadItem) => {
    if (file.file?.type?.startsWith('image/')) {
      return <ImageIcon className="h-4 w-4 text-blue-500" />;
    }
    return <FileText className="h-4 w-4 text-slate-500" />;
  }, []);

  const getFileType = useCallback((file: FileUploadItem) => {
    const type = file.file?.type || '';
    if (type.startsWith('image/')) return 'Image';
    if (type.includes('pdf')) return 'PDF';
    return 'Document';
  }, []);

  const handleDeletePendingFile = useCallback((fileId: string) => {
    setPendingFiles((prev) => prev.filter((file) => file.id !== fileId));
  }, []);

  // Preview a pending file — always available regardless of allowMultiple
  const handlePreviewClick = useCallback(
    (file: FileUploadItem) => {
      onPreviewFile?.(file);
    },
    [onPreviewFile]
  );

  const handleContinue = useCallback(() => {
    if (pendingFiles.length === 0) return;

    const filesToUpload = pendingFiles.map((file) => ({
      ...file,
      status: 'completed' as const,
      uploadedAt: new Date(),
    }));

    setUploadFiles((prev) =>
      allowMultiple ? [...prev, ...filesToUpload] : filesToUpload
    );

    const filesForCallback = pendingFiles.map(
      ({ file, id, preview, documentLabel }) => ({
        file,
        id,
        documentLabel,
        preview,
      })
    );

    onFilesChange?.(filesForCallback, defaultLabel);
    setPendingFiles([]);
  }, [pendingFiles, allowMultiple, onFilesChange, defaultLabel]);

  const handleCancelUpload = useCallback(() => {
    setPendingFiles([]);
  }, []);

  const [
    { isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      getInputProps,
    },
  ] = useFileUpload({
    maxFiles: allowMultiple ? maxFiles : 1,
    maxSize,
    accept: accept,
    multiple: allowMultiple,
    initialFiles: [],
    onFilesChange: (newFiles) => {
      if (isUploadDisabled) {
        return;
      }
      const newPendingFiles = newFiles.map((file) => ({
        ...file,
        progress: 0,
        status: 'uploading' as const,
        documentLabel: defaultLabel || 'N/A',
        uploadedAt: new Date(),
      }));

      setPendingFiles([...newPendingFiles]);
    },
  });

  return (
    <div className={cn('w-full space-y-6', className)}>
      {/* Upload Area */}
      <div
        className={cn(
          'relative rounded-xl border-2 border-dashed p-8 text-center transition-all',
          isDragging
            ? 'border-primary bg-primary/10 scale-[1.02]'
            : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-accent/50',
          (isUploadDisabled || hasPendingFiles) &&
          'opacity-50 pointer-events-none cursor-not-allowed'
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          {...getInputProps()}
          className="sr-only"
          disabled={isUploadDisabled || hasPendingFiles}
        />

        <div className="flex flex-col items-center gap-4">
          <div
            className={cn(
              'flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-primary/20 to-primary/5 transition-all',
              isDragging && 'scale-110 from-primary/30 to-primary/10'
            )}
          >
            <Upload className="h-6 w-6 text-primary" />
          </div>

          <div className="space-y-2">
            <p className="text-base font-semibold">
              {isUploadDisabled ? (
                hasFiles && !allowMultiple ? (
                  'File already uploaded. Multiple files not allowed.'
                ) : (
                  'Select a document type above to upload'
                )
              ) : hasPendingFiles ? (
                'Review files below and click Upload to send to server'
              ) : (
                <>
                  Drop files here or{' '}
                  <button
                    type="button"
                    onClick={openFileDialog}
                    className="cursor-pointer text-primary underline-offset-4 hover:underline"
                  >
                    browse files
                  </button>
                </>
              )}
            </p>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>Maximum file size: {formatBytes(maxSize)}</p>
              <p>
                {allowMultiple
                  ? `Maximum files: ${maxFiles} ${hasFiles ? `(${uploadFiles.length} uploaded)` : ''}`
                  : 'Only 1 file allowed'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Files Table */}
      {hasPendingFiles && (
        <div className="space-y-3">
          <div className="rounded-lg border border-amber-200 overflow-auto relative">
            <Table>
              <TableHeader>
                <TableRow className="bg-amber-50">
                  <TableHead className="w-12"></TableHead>
                  <TableHead>File Name</TableHead>
                  <TableHead className="w-24">Type</TableHead>
                  <TableHead className="w-24">Size</TableHead>
                  <TableHead className="w-20 text-right sticky right-0 bg-amber-50">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingFiles.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell>{getFileIcon(file)}</TableCell>
                    <TableCell className="font-medium">
                      <span className="truncate max-w-48 block">
                        {file.file?.name}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {getFileType(file)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatBytes(file.file?.size || 0)}
                    </TableCell>
                    <TableCell className="sticky right-0 bg-background p-0 text-right">
                      <div className="flex items-center justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-primary/70 hover:text-primary hover:bg-primary/10"
                          onClick={() => handlePreviewClick(file)}
                          title="Preview before upload"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>

                        {allowMultiple && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeletePendingFile(file.id)}
                            title="Remove"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Upload / Cancel Buttons */}
          <div className="flex gap-3 justify-center">
            <Button
              onClick={handleContinue}
              size={'xs'}
              className="cursor-pointer flex-1"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload {pendingFiles.length} File{pendingFiles.length > 1 ? 's' : ''}
            </Button>
            <Button
              onClick={handleCancelUpload}
              variant="destructive"
              size={'xs'}
              className="cursor-pointer flex-1"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Error Messages */}
      {errors.length > 0 && (
        <Alert variant="destructive" className="border-2">
          <TriangleAlert className="h-5 w-5" />
          <AlertTitle className="font-semibold">
            File upload error(s)
          </AlertTitle>
          <AlertDescription>
            {errors.map((error, index) => (
              <p key={index} className="last:mb-0 break-all">
                • {error}
              </p>
            ))}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

export default DocumentUploader;