import { Button } from '@/components/ui/button';
import {
  Download,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  FileText,
  Printer,
} from 'lucide-react';
import { useState, useRef, useEffect, memo, useCallback } from 'react';
import { b64toBlob } from '@/utils/helper';
import type { DocumentNode } from '@/hooks/use-document';
import type { Dispatch, SetStateAction } from 'react';

interface DocumentPreviewProps {
  document: DocumentNode | null;
  toggleDetails: boolean;
  setToggleDetails: Dispatch<SetStateAction<boolean>>;
}

/**
 * Determines the content type from a document's type and previewUrl.
 * Uses document.type as primary source, falls back to sniffing the data URI.
 */
// function resolveContentType(
//   doc: NormalizedDocument
// ): 'image' | 'pdf' | 'unknown' {
//   // Primary: trust the explicit type field
//   if (doc.type === 'image') return 'image';
//   if (doc.type === 'pdf') return 'pdf';

//   // Fallback: sniff the data URI mime type
//   const url = doc.previewUrl;
//   if (url) {
//     if (url.startsWith('data:image/')) return 'image';
//     if (url.startsWith('data:application/pdf')) return 'pdf';
//     // Blob URLs from local uploads — check file type
//     if (doc.file && typeof doc.file !== 'string') {
//       const mime = (doc.file as File).type;
//       if (mime?.startsWith('image/')) return 'image';
//       if (mime === 'application/pdf') return 'pdf';
//     }
//   }

//   return 'unknown';
// }

// ─── Empty State ────────────────────────────────────────────────────────────
function EmptyPreview({ message }: { message: string }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-center h-full bg-linear-to-br from-slate-50 to-slate-100">
        <div className="text-center max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-slate-200 flex items-center justify-center">
            <FileText className="w-12 h-12 text-slate-400" />
          </div>
          <h4 className="text-lg font-medium text-slate-700 mb-2">
            No Document Selected
          </h4>
          <p className="text-slate-500 text-sm">{message}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Image Viewer with Zoom / Pan ───────────────────────────────────────────
function ImageViewer({ src, label, toggleDetails, setToggleDetails }: { src: string; label: string, toggleDetails: boolean, setToggleDetails: Dispatch<SetStateAction<boolean>> }) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [loaded, setLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const printFrameRef = useRef<HTMLIFrameElement | null>(null);
  // Reset state when the source changes
  useEffect(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setLoaded(false);
  }, [src]);

  const handleZoomIn = useCallback(
    () => setScale((s) => Math.min(s + 0.25, 5)),
    []
  );
  const handleZoomOut = useCallback(
    () => setScale((s) => Math.max(s - 0.25, 0.25)),
    []
  );
  const handleReset = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const handleFit = useCallback(() => {
    if (imageRef.current && containerRef.current) {
      const cw = containerRef.current.clientWidth - 40;
      const ch = containerRef.current.clientHeight - 40;
      const iw = imageRef.current.naturalWidth;
      const ih = imageRef.current.naturalHeight;
      setScale(Math.min(cw / iw, ch / ih, 1));
      setPosition({ x: 0, y: 0 });
    }
  }, []);

  const handleLoad = useCallback(() => {
    setLoaded(true);
    setTimeout(handleFit, 100);
  }, [handleFit]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (scale > 0.50) {
        setIsDragging(true);
        setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
        e.preventDefault();
      }
    },
    [scale, position]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      setIsDragging((dragging) => {
        if (dragging) {
          setPosition({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y,
          });
        }
        return dragging;
      });
    },
    [dragStart]
  );

  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  const handlePrint = useCallback(() => {
    // Create hidden iframe for printing
    if (!printFrameRef.current) {
      const iframe = document.createElement('iframe');
      iframe.style.position = 'absolute';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = 'none';
      iframe.style.visibility = 'hidden';
      document.body.appendChild(iframe);
      printFrameRef.current = iframe;
    }

    const iframe = printFrameRef.current;
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;

    if (iframeDoc) {
      iframeDoc.open();
      iframeDoc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title class="print-title">Document Name: ${label}</title>
            <style>
              body {
                margin: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                background: white;
              }
              img {
                max-width: 100%;
                max-height: 100vh;
                object-fit: contain;
              }
              @media print {
                body {
                  -webkit-print-color-adjust: exact;
                  print-color-adjust: exact;
                }
              }
              title {
                font-size: 30px;
                font-weight:"bold";
              }
            </style>
          </head>
          <body>
            <img src="${src}" alt="${label}" />
          </body>
        </html>
      `);
      iframeDoc.close();

      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    }
  }, [src, label]);

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-2 border-b border-slate-200 bg-white shadow-sm">
        <h3 className="text-sm font-semibold text-slate-800 truncate">
          Document Preview
        </h3>
        <div className="flex items-center gap-2">
          {loaded && (
            <div className="flex items-center gap-1 mr-2 bg-slate-100 rounded-lg p-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomOut}
                disabled={scale <= 0.25}
                className="h-8 w-8 p-0 hover:bg-slate-200"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <div className="px-3 text-sm font-medium text-slate-700 min-w-15 text-center">
                {Math.round(scale * 100)}%
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomIn}
                disabled={scale >= 5}
                className="h-8 w-8 p-0 hover:bg-slate-200"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              <div className="w-px h-6 bg-slate-300 mx-1" />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="h-8 w-8 p-0 hover:bg-slate-200"
                title="Reset Zoom"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleFit}
                className="h-8 w-8 p-0 hover:bg-slate-200"
                title="Fit to Screen"
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(src, '_blank')}
            className="text-sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="text-sm"
          >
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setToggleDetails((prev: boolean) => !prev)}
            className="text-sm"
          >
            {toggleDetails ? 'Collapse page' : 'Expand page'}
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto bg-linear-to-br from-slate-50 to-slate-100 relative"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          cursor: isDragging ? 'grabbing' : scale > 1 ? 'grab' : 'default',
          userSelect: 'none',
        }}
      >
        <div className="h-full w-full flex items-center justify-center p-4">
          <div className="relative w-full h-full flex items-center justify-center overflow-auto">
            <div
              className="flex items-center justify-center"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                transformOrigin: 'center center',
                transition: isDragging ? 'none' : 'transform 0.15s ease-out',
                willChange: 'transform',
              }}
            >
              <img
                ref={imageRef}
                src={src}
                alt={label}
                onLoad={handleLoad}
                onError={() => setLoaded(true)}
                className="max-w-full max-h-full object-contain select-none shadow-2xl"
                draggable={false}
                style={{ imageRendering: scale > 2 ? 'auto' : 'crisp-edges' }}
              />
            </div>

            {/* Loading overlay */}
            {!loaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 border-4 border-slate-300 border-t-blue-600 rounded-full animate-spin" />
                  <p className="text-sm text-slate-600">Loading image…</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PDF Viewer ─────────────────────────────────────────────────────────────
function PdfViewer({ src, label, toggleDetails, setToggleDetails }: { src: string; label: string, toggleDetails: boolean, setToggleDetails: Dispatch<SetStateAction<boolean>> }) {
  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-2 border-b border-slate-200 bg-white shadow-sm">
        <h3 className="text-sm font-semibold text-slate-800 truncate">
          Document Preview
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setToggleDetails((prev: boolean) => !prev)}
          className="text-sm"
        >
          {toggleDetails ? 'Collapse page' : 'Expand page'}
        </Button>
      </div>

      {/* PDF iframe */}
      <div className="flex-1 relative bg-white">
        <iframe
          src={src}
          className="absolute inset-0 w-full h-full border-0"
          title={label}
        />
      </div>
    </div>
  );
}

//Main Preview Component
const DocumentPreview = memo(
  ({ document, toggleDetails, setToggleDetails }: DocumentPreviewProps) => {
    if (!document) {
      return (
        <EmptyPreview message="Select a document and upload a file to see the preview here." />
      );
    }
    const previewUrl = document.previewUrl;

    if (!previewUrl) {
      return (
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-2 border-b border-slate-200 bg-white shadow-sm">
            <h3 className="text-sm font-semibold text-slate-800 truncate">
              Document Preview
            </h3>
          </div>
          <div className="flex-1 flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100">
            <div className="text-center max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-slate-200 flex items-center justify-center">
                <FileText className="w-12 h-12 text-slate-400" />
              </div>
              <h4 className="text-lg font-medium text-slate-700 mb-2">
                No Preview Available
              </h4>
              <p className="text-slate-500 text-sm">
                {document.file
                  ? 'This document type cannot be previewed. Download the file to view its contents.'
                  : 'Upload a document to see the preview here.'}
              </p>
            </div>
          </div>
        </div>
      );
    }

    let urlToPreview;
    let contentType;

    if (previewUrl.startsWith('blob:')) {
      urlToPreview = previewUrl;
      contentType = document?.fileType;
    } else {
      urlToPreview = b64toBlob(
        previewUrl,
        document?.fileType === 'image' ? 'image/jpeg' : 'application/pdf'
      );
      contentType = document?.fileType;
    }

    const label = document.label || 'Document';

    if (contentType === 'image') {
      return <ImageViewer src={urlToPreview} label={label} toggleDetails={toggleDetails} setToggleDetails={setToggleDetails} />;
    }

    if (contentType === 'pdf') {
      return <PdfViewer src={urlToPreview} label={label} toggleDetails={toggleDetails} setToggleDetails={setToggleDetails} />;
    }

    // Unknown type – render in iframe as best effort
    return <PdfViewer src={urlToPreview} label={label} toggleDetails={toggleDetails} setToggleDetails={setToggleDetails} />;
  },
  (prev, next) => {
    return (
      prev.document?.id === next.document?.id &&
      prev.document?.previewUrl === next.document?.previewUrl &&
      prev.document?.type === next.document?.type &&
      prev.toggleDetails === next.toggleDetails
    );
  }
);

export default DocumentPreview;
