import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Eye, Plus, Edit, Trash2, X, Trash2Icon } from 'lucide-react';
import { cn } from '@/lib/utils';
import DocumentUploader from './document-uploader';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { DocumentNode } from '@/hooks/use-document';
import type { FileWithPreview } from '@/hooks/use-file-upload';
import { toast } from 'sonner';
import { DOCUMENT_SIZE_LIMIT } from '@/runtime-config';

interface ExistingDocumentCardProps {
  document: DocumentNode;
  onPreview: (documentIndex: string | undefined | null) => void;
  onAdd: (files: any[]) => void;
  onUpdate: (files: any[]) => void;
  onDelete: () => void;
  isLoadingFile?: boolean;
  /** Passed down to the uploader so the Eye button works in add/update mode */
  onPreviewFile?: (file: FileWithPreview) => void;
}

type ActionMode = 'preview' | 'add' | 'update' | null;

export function ExistingDocumentCard({
  document,
  onPreview,
  onAdd,
  onUpdate,
  onDelete,
  isLoadingFile = false,
  onPreviewFile,
}: ExistingDocumentCardProps) {
  const [actionMode, setActionMode] = useState<ActionMode>(null);

  const allowMultiple = document?.allowMultiple ?? true;
  const allowUpdate = document?.allowUpdate ?? true;
  const allowDelete = document?.allowDelete ?? true;

  const handlePreview = () => {
    setActionMode('preview');
    onPreview(document?.documentIndexId);
  };

  const handleAdd = () => {
    setActionMode('add');
  };

  const handleUpdate = () => {
    setActionMode('update');
  };

  const handleCancelAction = () => {
    setActionMode(null);
  };

  const handleFilesAdd = (files: any[]) => {
    onAdd(files);
    setActionMode(null);
  };

  const handleFilesUpdate = (files: any[]) => {
    onUpdate(files);
    setActionMode(null);
  };

  const handleDeleteClick = () => {
    toast.success("Deleted Successfully")
    onDelete();
  };
  const documentSizeLimit = DOCUMENT_SIZE_LIMIT && DOCUMENT_SIZE_LIMIT * 1024 * 1024;

  return (
    <div className="bg-white   space-y-4   h-screen overflow-y-scroll">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <div className="p-2 rounded-full bg-blue-100 shrink-0">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">{document.label}</p>
            <p className="text-xs text-secondary mt-1">
              Document exists in the system
            </p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <Badge variant="default" className="text-xs bg-primary">
                Existing File
              </Badge>
              {document.isRequired && (
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
      </div>

      {/* Action Buttons - Show when not in add/update mode */}
      <div className="space-y-2">
        {/* Preview Button - Always available */}
        <Button
          onClick={handlePreview}
          className="w-full"
          variant={'default'}
          size="sm"
          disabled={isLoadingFile}
        >
          <Eye className="w-4 h-4 mr-2" />
          {isLoadingFile ? 'Fetching Document...' : 'Preview Document'}
        </Button>

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-2 gap-2">
          {/* Add Button - Only if allowMultiple */}
          {allowMultiple && (
            <Button
              onClick={handleAdd}
              variant="outline"
              size="sm"
              className="border-green-300 text-green-700 hover:bg-green-50"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add More
            </Button>
          )}

          {/* Update Button - Only if allowUpdate */}
          {allowUpdate && (
            <Button
              onClick={handleUpdate}
              variant="outline"
              size="sm"
              className={cn(
                'border-blue-300 text-blue-700 hover:bg-blue-50',
                !allowMultiple && 'col-span-2'
              )}
            >
              <Edit className="w-4 h-4 mr-2" />
              Update
            </Button>
          )}

          {/* Delete Button - Only if allowDelete */}
          {allowDelete && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    'border-red-300 text-red-600 hover:bg-red-50',
                    (!allowMultiple || !allowUpdate) && 'col-span-2'
                  )}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent size="sm">
                <AlertDialogHeader>
                  <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                    <Trash2Icon />
                  </AlertDialogMedia>
                  <AlertDialogTitle onClick={handleDeleteClick}>Are you sure you want to delete this document?</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
                  <AlertDialogAction variant="destructive">Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>


          )}
        </div>
      </div>

      {/* Document Uploader - Show in add/update mode */}
      {(actionMode === 'add' || actionMode === 'update') && (
        <div className="space-y-3">
          <div className="flex items-center justify-between bg-slate-100 p-3 rounded-lg">
            <p className="text-sm font-medium text-slate-700">
              {actionMode === 'add' ? 'Add New File' : 'Update Existing File'}
            </p>
            <Button
              onClick={handleCancelAction}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <DocumentUploader
            maxSize={documentSizeLimit}
            onFilesChange={
              actionMode === 'add' ? handleFilesAdd : handleFilesUpdate
            }
            onPreviewFile={onPreviewFile}
            className="bg-slate-50"
            defaultLabel={document.label}
            activeDocument={document}
            accept={document.allowedFileExtensions?.map(x => `.${x}`).join(",") || ''}
          />

          {/* <div className="flex gap-2">
            <Button
              onClick={handleCancelAction}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              Cancel
            </Button>
          </div> */}
        </div>
      )}

      {/* Document Info */}
      <div className="bg-slate-50 rounded-lg p-3 space-y-2">
        <h5 className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
          Document Information
        </h5>
        <div className="space-y-1 text-xs text-slate-600">
          <div className="flex items-center justify-between">
            <span>Remarks:</span>
            <span className="font-medium text-slate-800">
              {document.remarks || 'N/A'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Created At:</span>
            <span className="font-medium text-slate-800">
              {document.creartedDate || 'N/A'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Created By:</span>
            <span className="font-medium text-slate-800">
              {document.createdBy || 'N/A'}
            </span>
          </div>
        </div>
      </div>


    </div>
  );
}
