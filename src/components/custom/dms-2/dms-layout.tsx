import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import type { ReactNode } from 'react';
import DocumentStrip from './document-navbar-strip';
import type { DocumentNode } from '@/hooks/use-document';
import { useIsMobile } from '@/hooks/use-mobile';

interface DMSLayoutProps {
  children: ReactNode;
  enrollmentId: string;
  documents: DocumentNode[];
  activeIndex: string | null;
  onSelectDocument: (selectedNodeId: string) => void;
}

const DMSLayout = ({
  children,
  // enrollmentId,
  documents,
  activeIndex,
  onSelectDocument,
}: DMSLayoutProps) => {
  const isMobile = useIsMobile();
  return (
    <SidebarProvider>
      <DocumentStrip
        treeDocuments={documents}
        selectedDocumentId={activeIndex}
        onSelectNodeId={onSelectDocument}
        className="border-r"
      />
      <SidebarInset className={`flex flex-col h-screen ${isMobile ? 'overflow-auto' : 'overflow-hidden'}`}>
        <main className={`relative flex-1 h-fit ${isMobile ? 'overflow-auto' : 'overflow-hidden'}`}>
          <div className="h-full flex flex-col w-full">
            <div className="bg-[url('/src/assets/images/mountainbg-white.png')]">
              {children}
            </div>
          </div>
          <SidebarTrigger className="text-primary-foreground bg-primary absolute top-1/2 -left-2 z-10 text-3xl hover:text-primary hover:bg-primary-foreground" />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DMSLayout;