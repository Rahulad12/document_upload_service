// // import {
// //   Sidebar,
// //   SidebarContent,
// //   SidebarMenu,
// //   SidebarMenuButton,
// //   SidebarMenuItem,
// //   SidebarTrigger,
// //   useSidebar,
// // } from '@/components/ui/sidebar';
// // import { Skeleton } from '@/components/ui/skeleton';
// // import { cn } from '@/lib/utils';
// // import type { ChildNode, DMSRequiredDocument, Document, RootNodeTree, SubChilNode, SubDocument } from '@/types/types';
// // import { ChevronRight, FileText, Folder } from 'lucide-react';
// // import { useEffect, useState } from 'react';
// // import { Badge } from '@/components/ui/badge';
// // import { useDocumentPreview } from '@/hooks/use-document-preview';

// // interface DocumentStripProps extends Omit<
// //   React.ComponentProps<typeof Sidebar>,
// //   'onSelect'
// // > {
// //   treeDocuments: RootNodeTree[];
// //   selectedDocumentId: string;
// //   onSelectNodeId: (selctedNodeId: string) => void;
// //   isLoading?: boolean;
// // }

// // interface DocumentNodeProps {
// //   node: ChildNode;
// //   parentCategory: RootNodeTree;
// //   depth?: number;
// //   onSelectDocumentNodeId: (selctedNodeId: string) => void;
// //   selectedDocumentId: string;
// // }

// // interface SubDocumentNodeProps {
// //   subDoc: SubDocument;
// //   parentDoc: ChildNode;
// //   parentCategory: RootNodeTree;
// //   depth: number;
// //   onSelectSubNodeId: (selctedNodeId: string) => void;
// //   selectedDocumentId: string;
// // }

// // const SubDocumentNode = ({
// //   subDoc,
// //   parentDoc,
// //   parentCategory,
// //   depth,
// //   onSelectSubNodeId,
// //   selectedDocumentId,
// // }: SubDocumentNodeProps) => {
// //   const { clearPreview } = useDocumentPreview();
// //   useEffect(() => {
// //     return () => {
// //       clearPreview();
// //     };
// //   }, []);
// //   const nodeId = `${parentCategory.id}-${parentDoc.DocumentId}-${subDoc.DocumentId}`;
// //   const isSelected = selectedDocumentId === nodeId;

// //   const handleClick = () => {
// //     onSelectSubNodeId(nodeId);
// //   };

// //   return (
// //     <SidebarMenuButton
// //       onClick={handleClick}
// //       className={cn(
// //         'w-full flex items-center justify-between gap-2 h-auto py-2 px-3 transition-all',
// //         isSelected && 'bg-primary-foreground text-primary',
// //         !isSelected &&
// //           'hover:bg-primary-foreground/10 hover:text-primary-foreground'
// //       )}
// //       style={{ paddingLeft: `${depth * 12 + 12}px` }}
// //     >
// //       <div className="flex items-center gap-2 flex-1 min-w-0">
// //         <FileText
// //           className={cn(
// //             'h-4 w-4 shrink-0',
// //             isSelected ? 'text-primary' : 'text-primary-foreground'
// //           )}
// //         />
// //         <span className="text-sm font-medium truncate">
// //           {subDoc.DocumentName}
// //         </span>
// //       </div>
// //     </SidebarMenuButton>
// //   );
// // };

// // const DocumentNode = ({
// //   node,
// //   parentCategory,
// //   depth = 0,
// //   onSelectDocumentNodeId,
// //   selectedDocumentId,
// // }: DocumentNodeProps) => {
// //   const [isExpanded, setIsExpanded] = useState(true);
// //   const hasChildren = node.SubDocuments && node.SubDocuments.length > 0;
// //   const nodeId = `${parentCategory.id}-${node.DocumentId}`;
// //   const isSelected = selectedDocumentId === nodeId;

// //   const handleClick = () => {
// //     if (hasChildren) {
// //       setIsExpanded(!isExpanded);
// //     } else {
// //       onSelectDocumentNodeId(nodeId);
// //     }
// //   };

// //   return (
// //     <div className="w-full">
// //       <SidebarMenuButton
// //         onClick={handleClick}
// //         className={cn(
// //           'w-full flex items-center justify-between gap-2 h-auto py-2 px-3 transition-all',
// //           isSelected && 'bg-primary-foreground text-primary',
// //           !isSelected &&
// //             'hover:bg-primary-foreground/10 hover:text-primary-foreground'
// //         )}
// //         style={{ paddingLeft: `${depth * 12 + 12}px` }}
// //       >
// //         <div className="flex items-center gap-2 flex-1 min-w-0">
// //           {hasChildren ? (
// //             <>
// //               <ChevronRight
// //                 className={cn(
// //                   'h-3 w-3 shrink-0 transition-transform',
// //                   isExpanded && 'rotate-90',
// //                   isSelected ? 'text-primary' : 'text-primary-foreground'
// //                 )}
// //               />
// //               <Folder
// //                 className={cn(
// //                   'h-4 w-4 shrink-0',
// //                   isSelected ? 'text-primary' : 'text-primary-foreground'
// //                 )}
// //               />
// //             </>
// //           ) : (
// //             <FileText
// //               className={cn(
// //                 'h-4 w-4 shrink-0',
// //                 isSelected ? 'text-primary' : 'text-primary-foreground'
// //               )}
// //             />
// //           )}
// //           <span className="text-sm font-medium truncate">
// //             {node.DocumentName}
// //           </span>
// //         </div>
// //         {node.IsRequired && (
// //           <span className="text-red-400 text-xs font-bold">*</span>
// //         )}
// //       </SidebarMenuButton>

// //       {/* Render SubDocuments if expanded */}
// //       {hasChildren && isExpanded && (
// //         <div className="w-full">
// //           {node?.SubDocuments!.map((subDoc: SubChilNode) => (
// //             <SubDocumentNode
// //               key={subDoc.DocumentId}
// //               subDoc={subDoc}
// //               parentDoc={node}
// //               parentCategory={parentCategory}
// //               depth={depth + 2}
// //               onSelectSubNodeId={onSelectDocumentNodeId}
// //               selectedDocumentId={selectedDocumentId}
// //             />
// //           ))}
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // const DocumentStrip = ({
// //   treeDocuments,
// //   selectedDocumentId,
// //   onSelectNodeId,
// //   className,
// //   isLoading,
// //   ...props
// // }: DocumentStripProps) => {
// //   const { isMobile } = useSidebar();
// //   const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
// //     new Set()
// //   );

// //   const toggleCategory = (categoryId: string) => {
// //     setExpandedCategories((prev) => {
// //       const newSet = new Set(prev);
// //       if (newSet.has(categoryId)) {
// //         newSet.delete(categoryId);
// //       } else {
// //         newSet.add(categoryId);
// //       }
// //       return newSet;
// //     });
// //   };

// //   if (isLoading) {
// //     return <Skeleton className="h-full w-full" />;
// //   }

// //   return (
// //     <Sidebar
// //       className={cn('bg-primary text-primary-foreground', className)}
// //       collapsible="offcanvas"
// //       {...props}
// //     >
// //       <SidebarContent className="gap-0 bg-primary">
// //         <div className="flex-1 overflow-auto">
// //           <SidebarMenu className="gap-0 p-1">
// //             {treeDocuments.map((category) => {
// //               const isCategoryExpanded = expandedCategories.has(category.id);

// //               return (
// //                 <div key={category.id} className="w-full">
// //                   {/* Category Header */}
// //                   <SidebarMenuItem>
// //                     <SidebarMenuButton
// //                       onClick={() => toggleCategory(category.id)}
// //                       className="w-full flex items-center justify-between gap-2 h-auto py-2.5 px-3 hover:bg-primary-foreground/10 hover:text-primary-foreground"
// //                     >
// //                       <div className="flex items-center gap-2 flex-1 min-w-0">
// //                         <ChevronRight
// //                           className={cn(
// //                             'h-4 w-4 shrink-0 transition-transform',
// //                             isCategoryExpanded && 'rotate-90',
// //                             'text-primary-foreground'
// //                           )}
// //                         />
// //                         <Folder className="h-5 w-5 shrink-0 text-primary-foreground" />
// //                         <span className="text-sm font-semibold truncate">
// //                           {category.label}
// //                         </span>
// //                       </div>
// //                       {/* <div className="flex items-center gap-2">
// //                         {category.IsRequired && (
// //                           <Badge
// //                             variant="secondary"
// //                             className="bg-[#7AB2B2] text-[#280905] text-xs px-2 py-0.5"
// //                           >
// //                             {category.MandaryDocumentsCount}
// //                             <span className="text-red-700 font-bold ml-1">
// //                               *
// //                             </span>
// //                           </Badge>
// //                         )}
// //                       </div> */}
// //                     </SidebarMenuButton>
// //                   </SidebarMenuItem>

// //                   {/* Category Documents - Recursively rendered */}
// //                   {isCategoryExpanded &&
// //                     category?.children?.map((doc: ChildNode) => (
// //                       <DocumentNode
// //                         key={doc.DocumentId}
// //                         node={doc}
// //                         parentCategory={category}
// //                         depth={1}
// //                         onSelectDocumentNodeId={onSelectNodeId}
// //                         selectedDocumentId={selectedDocumentId}
// //                       />
// //                     ))}
// //                 </div>
// //               );
// //             })}
// //           </SidebarMenu>
// //           {isMobile && <SidebarTrigger />}
// //         </div>
// //       </SidebarContent>
// //     </Sidebar>
// //   );
// // };

// // export default DocumentStrip;

// import {
//   Sidebar,
//   SidebarContent,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
//   SidebarTrigger,
//   useSidebar,
// } from '@/components/ui/sidebar';
// import { Skeleton } from '@/components/ui/skeleton';
// import { cn } from '@/lib/utils';
// import type { ChildNode, DMSRequiredDocument, Document, RootNodeTree, SubChilNode, SubDocument } from '@/types/types';
// import { ChevronRight, FileText, Folder } from 'lucide-react';
// import { useEffect, useState } from 'react';
// import { Badge } from '@/components/ui/badge';
// import { useDocumentPreview } from '@/hooks/use-document-preview';

// interface DocumentStripProps extends Omit<
//   React.ComponentProps<typeof Sidebar>,
//   'onSelect'
// > {
//   treeDocuments: RootNodeTree[];
//   selectedDocumentId: string | null;
//   onSelectNodeId: (selctedNodeId: string) => void;
//   isLoading?: boolean;
// }

// interface DocumentNodeProps {
//   node: ChildNode;
//   parentCategory: RootNodeTree;
//   depth?: number;
//   onSelectDocumentNodeId: (selctedNodeId: string) => void;
//   selectedDocumentId: string | null;
// }

// interface SubDocumentNodeProps {
//   subDoc: SubDocument;
//   parentDoc: ChildNode;
//   parentCategory: RootNodeTree;
//   depth: number;
//   onSelectSubNodeId: (selctedNodeId: string) => void;
//   selectedDocumentId: string | null;
// }

// const SubDocumentNode = ({
//   subDoc,
//   parentDoc,
//   parentCategory,
//   depth,
//   onSelectSubNodeId,
//   selectedDocumentId,
// }: SubDocumentNodeProps) => {
//   const { clearPreview } = useDocumentPreview();
//   useEffect(() => {
//     return () => {
//       clearPreview();
//     };
//   }, []);
//   const nodeId = `${parentCategory.id}-${parentDoc.DocumentId}-${subDoc.DocumentId}`;
//   const isSelected = selectedDocumentId === nodeId;

//   const handleClick = () => {
//     onSelectSubNodeId(nodeId);
//   };

//   return (
//     <SidebarMenuButton
//       onClick={handleClick}
//       className={cn(
//         'w-full flex items-center justify-between gap-2 h-auto py-2 px-3 transition-all',
//         isSelected && 'bg-primary-foreground text-primary',
//         !isSelected &&
//           'hover:bg-primary-foreground/10 hover:text-primary-foreground'
//       )}
//       style={{ paddingLeft: `${depth * 12 + 12}px` }}
//     >
//       <div className="flex items-center gap-2 flex-1 min-w-0">
//         <FileText
//           className={cn(
//             'h-4 w-4 shrink-0',
//             isSelected ? 'text-primary' : 'text-primary-foreground'
//           )}
//         />
//         <span className="text-sm font-medium truncate">
//           {subDoc.DocumentName}
//         </span>
//       </div>
//     </SidebarMenuButton>
//   );
// };

// const DocumentNode = ({
//   node,
//   parentCategory,
//   depth = 0,
//   onSelectDocumentNodeId,
//   selectedDocumentId,
// }: DocumentNodeProps) => {
//   console.log('node', node);
//   const [isExpanded, setIsExpanded] = useState(true);
//   const hasChildren = node.Children && node.Children.length > 0;
//   const nodeId = `${parentCategory.id}-${node.DocumentId}`;
//   // Only allow selection if node has no children (is a file, not a folder)
//   const isSelected = !hasChildren && selectedDocumentId === nodeId;

//   const handleClick = () => {
//     if (hasChildren) {
//       // If has children, just toggle expansion - don't select
//       setIsExpanded(!isExpanded);
//     } else {
//       // If no children, select the document
//       onSelectDocumentNodeId(nodeId);
//     }
//   };

//   return (
//     <div className="w-full">
//       <SidebarMenuButton
//         onClick={handleClick}
//         className={cn(
//           'w-full flex items-center justify-between gap-2 h-auto py-2 px-3 transition-all',
//           // Only apply selected styles if it's a file (no children)
//           isSelected && 'bg-primary-foreground text-primary',
//           !isSelected &&
//             'hover:bg-primary-foreground/10 hover:text-primary-foreground'
//         )}
//         style={{ paddingLeft: `${depth * 12 + 12}px` }}
//       >
//         <div className="flex items-center gap-2 flex-1 min-w-0">
//           {hasChildren ? (
//             <>
//               <ChevronRight
//                 className={cn(
//                   'h-3 w-3 shrink-0 transition-transform',
//                   isExpanded && 'rotate-90',
//                   'text-primary-foreground'
//                 )}
//               />
//               <Folder
//                 className={cn(
//                   'h-4 w-4 shrink-0',
//                   'text-primary-foreground'
//                 )}
//               />
//             </>
//           ) : (
//             <FileText
//               className={cn(
//                 'h-4 w-4 shrink-0',
//                 isSelected ? 'text-primary' : 'text-primary-foreground'
//               )}
//             />
//           )}
//           <span className="text-sm font-medium truncate">
//             {node.DocumentName}
//           </span>
//         </div>
//         {/* Only show required indicator for files, not folders */}
//         {!hasChildren && node.IsRequired && (
//           <span className="text-red-400 text-xs font-bold">*</span>
//         )}
//       </SidebarMenuButton>

//       {/* Render SubDocuments if expanded */}
//       {hasChildren && isExpanded && (
//         <div className="w-full">
//           {node?.Children?.map((subDoc: SubChilNode) => (
//             <SubDocumentNode
//               key={subDoc.DocumentId}
//               subDoc={subDoc}
//               parentDoc={node}
//               parentCategory={parentCategory}
//               depth={depth + 2}
//               onSelectSubNodeId={onSelectDocumentNodeId}
//               selectedDocumentId={selectedDocumentId}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// const DocumentStrip = ({
//   treeDocuments,
//   selectedDocumentId,
//   onSelectNodeId,
//   className,
//   isLoading,
//   ...props
// }: DocumentStripProps) => {
//   console.log('treeDocuments', treeDocuments);
//   const { isMobile } = useSidebar();
//   const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
//     new Set()
//   );

//   const toggleCategory = (categoryId: string) => {
//     setExpandedCategories((prev) => {
//       const newSet = new Set(prev);
//       if (newSet.has(categoryId)) {
//         newSet.delete(categoryId);
//       } else {
//         newSet.add(categoryId);
//       }
//       return newSet;
//     });
//   };

//   if (isLoading) {
//     return <Skeleton className="h-full w-full" />;
//   }

//   return (
//     <Sidebar
//       className={cn('bg-primary text-primary-foreground', className)}
//       collapsible="offcanvas"
//       {...props}
//     >
//       <SidebarContent className="gap-0 bg-primary">
//         <div className="flex-1 overflow-auto">
//           <SidebarMenu className="gap-0 p-1">
//             {treeDocuments.map((category) => {
//               const isCategoryExpanded = expandedCategories.has(category.id);

//               return (
//                 <div key={category.id} className="w-full">
//                   {/* Category Header */}
//                   <SidebarMenuItem>
//                     <SidebarMenuButton
//                       onClick={() => toggleCategory(category.id)}
//                       className="w-full flex items-center justify-between gap-2 h-auto py-2.5 px-3 hover:bg-primary-foreground/10 hover:text-primary-foreground"
//                     >
//                       <div className="flex items-center gap-2 flex-1 min-w-0">
//                         <ChevronRight
//                           className={cn(
//                             'h-4 w-4 shrink-0 transition-transform',
//                             isCategoryExpanded && 'rotate-90',
//                             'text-primary-foreground'
//                           )}
//                         />
//                         <Folder className="h-5 w-5 shrink-0 text-primary-foreground" />
//                         <span className="text-sm font-semibold truncate">
//                           {category.label}
//                         </span>
//                       </div>
//                       {/* <div className="flex items-center gap-2">
//                         {category.IsRequired && (
//                           <Badge
//                             variant="secondary"
//                             className="bg-[#7AB2B2] text-[#280905] text-xs px-2 py-0.5"
//                           >
//                             {category.MandaryDocumentsCount}
//                             <span className="text-red-700 font-bold ml-1">
//                               *
//                             </span>
//                           </Badge>
//                         )}
//                       </div> */}
//                     </SidebarMenuButton>
//                   </SidebarMenuItem>

//                   {/* Category Documents - Recursively rendered */}
//                   {isCategoryExpanded &&
//                     category?.children?.map((doc: ChildNode) => (
//                       <DocumentNode
//                         key={doc.DocumentId}
//                         node={doc}
//                         parentCategory={category}
//                         depth={1}
//                         onSelectDocumentNodeId={onSelectNodeId}
//                         selectedDocumentId={selectedDocumentId}
//                       />
//                     ))}
//                 </div>
//               );
//             })}
//           </SidebarMenu>
//           {isMobile && <SidebarTrigger />}
//         </div>
//       </SidebarContent>
//     </Sidebar>
//   );
// };

// export default DocumentStrip;

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import type { DocumentNode } from '@/hooks/use-document';
import { cn } from '@/lib/utils';
import { ChevronRight, FileText, Folder } from 'lucide-react';
import { useState, useEffect } from 'react';
import Logo from '../common/logo';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface DocumentStripProps extends Omit<
  React.ComponentProps<typeof Sidebar>,
  'onSelect'
> {
  treeDocuments: DocumentNode[];
  selectedDocumentId: string | null;
  onSelectNodeId: (selectedNodeId: string) => void;
  isLoading?: boolean;
}

interface TreeNodeProps {
  node: DocumentNode;
  depth?: number;
  selectedDocumentId: string | null;
  onSelectNodeId: (id: string) => void;
  searchTerm?: string;
}

const TreeNode = ({
  node,
  depth = 0,
  selectedDocumentId,
  onSelectNodeId,
  searchTerm = '',
}: TreeNodeProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasChildren = node.children && node.children.length > 0;
  const isSelected = selectedDocumentId === node.id;

  // Auto-expand if search term matches a child
  useEffect(() => {
    if (searchTerm && hasChildren) {
      const hasMatchingChild = (n: DocumentNode): boolean => {
        if (n.label.toLowerCase().includes(searchTerm.toLowerCase())) return true;
        if (n.children) return n.children.some(hasMatchingChild)
        return false;
      }
      if (node.children?.some(hasMatchingChild)) {
        setIsExpanded(true);
      }
    }
  }, [searchTerm, hasChildren, node.children]);

  const handleClick = () => {
    if (hasChildren) {
      setIsExpanded((prev: boolean) => !prev);
    } else {
      onSelectNodeId(node.id);
    }
  };

  return (
    <div className="w-full">
      <SidebarMenuButton
        onClick={handleClick}
        className={cn(
          'w-full flex items-center justify-between gap-2 h-auto py-2 px-3 transition-all text-primary-foreground',
          isSelected && 'bg-primary-foreground text-primary!',
          !isSelected &&
          'hover:bg-primary-foreground/10 hover:text-primary-foreground'
        )}
        style={{ paddingLeft: `${depth * 14 + 12}px` }}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {hasChildren ? (
            <>
              <ChevronRight
                className={cn(
                  'h-3 w-3 shrink-0 transition-transform',
                  isExpanded && 'rotate-90',
                  'text-primary-foreground'
                )}
              />
              <Folder className="h-4 w-4 shrink-0 text-primary-foreground" />
            </>
          ) : (
            <FileText
              className={cn(
                'h-4 w-4 shrink-0',
                isSelected ? 'text-primary' : 'text-primary-foreground'
              )}
            />
          )}

          <span className="text-sm font-medium truncate">
            {node.label}{' '}
            {!hasChildren && node.isRequired && (
              <span className="text-red-400 text-xs font-bold">*</span>
            )}
          </span>
          {node?.mandatoryDocumentCount && node?.mandatoryDocumentCount > 0 && (
            <Badge
              variant="ghost"
              className="text-xs bg-orange-400 rounded-2xl text-white"
            >
              {node.mandatoryDocumentCount} *
            </Badge>
          )}
        </div>
      </SidebarMenuButton>

      {/* Recursive Children */}
      {hasChildren && isExpanded && (
        <div className="w-full">
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1 + 1}
              selectedDocumentId={selectedDocumentId}
              onSelectNodeId={onSelectNodeId}
              searchTerm={searchTerm}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const DocumentSidebar = ({
  treeDocuments,
  selectedDocumentId,
  onSelectNodeId,
  className,
  isLoading,
  ...props
}: DocumentStripProps) => {
  const { isMobile, open } = useSidebar();
  const [searchTerm, setSearchTerm] = useState('');

  if (isLoading) {
    return <Skeleton className="h-full w-full" />;
  }

  // Filtering logic
  const filterNodes = (nodes: DocumentNode[], term: string): DocumentNode[] => {
    if (!term) return nodes;

    return nodes.reduce((acc: DocumentNode[], node) => {
      const matches = node.label.toLowerCase().includes(term.toLowerCase());
      const filteredChildren = node.children ? filterNodes(node.children, term) : [];

      if (matches || filteredChildren.length > 0) {
        acc.push({
          ...node,
          children: filteredChildren.length > 0 ? filteredChildren : node.children
        });
      }
      return acc;
    }, []);
  };

  const filteredDocuments = filterNodes(treeDocuments, searchTerm);

  return (
    <Sidebar
      variant="sidebar"
      className={cn('text-primary-foreground', className)}
      collapsible="offcanvas"
      {...props}
    >
      <SidebarHeader className="p-2 space-y-2">
        <div className="flex items-center">
          {open || isMobile ? <Logo /> : <img src="/images/logo.png" className="w-8 h-8" />}
        </div>
        {(open || isMobile) && (
          <div className="px-2 relative">
            <Input
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-primary text-black placeholder:text-primary/50 h-8 text-xs focus-visible:ring-primary/20 focus-visible:border-primary"
            />
          </div>
        )}
      </SidebarHeader>
      <SidebarContent className="gap-0 bg-primary">
        <div className="flex-1 overflow-auto bg-[url('@/assets/images/mountainbg-white.png')] bg-bottom bg-no-repeat bg-contain">
          <SidebarMenu className="gap-0 p-1">
            {filteredDocuments.map((category) => (
              <SidebarMenuItem key={category.id}>
                <TreeNode
                  node={category}
                  depth={0}
                  selectedDocumentId={selectedDocumentId}
                  onSelectNodeId={onSelectNodeId}
                  searchTerm={searchTerm}
                />
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

export default DocumentSidebar;
