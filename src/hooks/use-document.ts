// %%%%%%

// import { useState, useMemo, useCallback } from 'react';
// import { toast } from 'sonner';
// import { useGetDocumentImage } from '@/services/hooks/use-documents';
// import type { FileWithPreview } from './use-file-upload';
// import type { DMSRequiredDocument } from '@/types/types';

// type Node = any;

// export function useDocument(initialDocuments: DMSRequiredDocument[]) {
//   const { mutateAsync: getDocumentImage, isPending } = useGetDocumentImage();
//   // NORMALIZE ONCE
//   const normalize = (docs: any[]) => {
//     const entities: Record<string, Node> = {};
//     const tree: any[] = [];

//     docs.forEach((category) => {
//       const catNode = {
//         id: category.Id,
//         label: category.DocumentName,
//         allowedFileExtensions: category.AllowedFileExtensions,
//         mandatoryDocumentCount: category.MandatoryDocumentCount,
//         children: [] as string[],
//       };

//       category.Documents?.forEach((doc: any) => {
//         const docId = `${category.Id}-${doc.DocumentId}`;

//         entities[docId] = { ...doc };
//         catNode.children.push(docId);

//         doc.SubDocuments?.forEach((sub: any) => {
//           const subId = `${category.Id}-${doc.DocumentId}-${sub.DocumentId}`;

//           entities[subId] = { ...sub };
//           catNode.children.push(subId);
//         });
//       });

//       tree.push(catNode);
//     });

//     return { entities, tree };
//   };

//   const [{ entities, tree }, setStore] = useState(() =>
//     normalize(initialDocuments)
//   );

//   const [activeId, setActiveId] = useState<string>('');

//   //O(1) GETTERS

//   const activeDocument = useMemo(
//     () => (activeId ? entities[activeId] : null),
//     [activeId, entities]
//   );

//   // O(1) MUTATOR

//   const mutate = useCallback(
//     (updater: (node: Node) => void) => {
//       if (!activeId) return;

//       setStore((prev) => {
//         const node = prev.entities[activeId];
//         if (!node) return prev;

//         const updatedNode = { ...node };
//         updater(updatedNode);

//         return {
//           ...prev,
//           entities: {
//             ...prev.entities,
//             [activeId]: updatedNode,
//           },
//         };
//       });
//     },
//     [activeId]
//   );

//   // HANDLERS

//   const handleUpload = (files: FileWithPreview[]) => {
//     if (!activeId) return;

//     const actualFile = files[0].file;
//     const previewUrl = files[0].preview;
//     const isImage = actualFile.type?.startsWith('image/');

//     mutate((node) => {
//       node.file = files;
//       node.previewUrl = previewUrl;
//       node.type = isImage ? 'image' : 'pdf';
//       node.doesExist = true;
//     });

//     toast.success('Uploaded');
//   };

//   const handleReplace = () =>
//     mutate((node) => {
//       node.file = undefined;
//       node.previewUrl = undefined;
//     });

//   const handleDelete = () =>
//     mutate((node) => {
//       node.file = undefined;
//       node.previewUrl = undefined;
//     });
// const handleSelectedDocumentNodeId = (id:string) =>{
//   setActiveId(id);
// }

//   const handlePreview = async (index?: string | null | undefined) => {
//     if (!index) return;

//     const res = await getDocumentImage({
//       DocumentIndexId: index,
//       MerchantId: 'string',
//       TransactionId: 'string',
//     });

//     mutate((node) => {
//       node.previewUrl = res.data.Result.DocContent;
//       node.type = res.data.Result.CreatedByAppName === 'pdf' ? 'pdf' : 'image';
//     });
//   };
//   console.log('activeDocument', activeDocument);
//   console.log({ tree, entities });
//   //DERIVE TREE FOR UI
//   const documentsForUI = useMemo(() => {
//     return tree.map((category) => ({
//       ...category,
//       children: category.children.map((id: string) => entities[id]),
//     }));
//   }, [tree, entities]);

//   console.log('documentsForUI', documentsForUI);
//   return {
//     documents: documentsForUI,
//     activeDocument,
//     activeIndex:activeId,
//     setActiveId,
//     handleUpload,
//     handleReplace,
//     handleDelete,
//     handlePreview,
//     isDocumentPreviewLoading: isPending,
//     handleSelectedDocumentNodeId
//   };
// }

// changed
import { useState, useMemo, useCallback } from 'react';
import { toast } from 'sonner';
import {
  useGetDocumentImage,
  useUploadDocuments,
} from '@/services/hooks/use-documents';

import type { FileWithPreview } from './use-file-upload';
import type { DMSRequiredDocument, Document, SubDocument } from '@/types/types';
import { convertToBase64 } from '@/utils/helper';

//COMMON NODE TYPE (for category / document / subdocument)

export type DocumentNodeType = 'category' | 'document' | 'subdocument';

export interface DocumentNode {
  id: string;
  parentId: string | null;
  type: DocumentNodeType;
  allowMultiple: boolean;
  allowUpdate: boolean;
  allowDelete?: boolean;
  isRequired: boolean;
  label: string;

  documentIndexId?: string;
  allowedFileExtensions?: string[];
  mandatoryDocumentCount?: number;

  doesExist?: boolean;

  file?: File;
  previewUrl?: string;
  fileType?: 'image' | 'pdf';

  children: any[];
}

//HOOK

export function useDocument(initialDocuments: DMSRequiredDocument[]) {
  const { mutateAsync: getDocumentImage, isPending } = useGetDocumentImage();
  //NORMALIZE (FIXED STRUCTURE - SCALABLE)
  const normalize = (docs: DMSRequiredDocument[]) => {
    const entities: Record<string, DocumentNode> = {};
    const rootIds: string[] = [];

    docs.forEach((category) => {
      const categoryId = category.Id;

      entities[categoryId] = {
        id: categoryId,
        parentId: null,
        type: 'category',
        label: category.DocumentName,
        allowedFileExtensions: category.AllowedFileExtensions,
        mandatoryDocumentCount: category.MandaryDocumentsCount,
        children: [],
        allowUpdate: category.IsAllowedUpdate,
        allowMultiple: category.IsAllowedMultiple,
        isRequired: category.IsRequired,
      };

      rootIds.push(categoryId);

      category.Documents?.forEach((doc: Document) => {
        const docId = `${categoryId}-${doc.DocumentId}`;

        entities[docId] = {
          id: docId,
          parentId: categoryId,
          type: 'document',
          label: doc.DocumentName,
          documentIndexId: doc.DocumentIndex,
          allowedFileExtensions: category.AllowedFileExtensions,
          doesExist: category.DoesExist || true,
          children: [],
          allowUpdate: doc.IsAllowedUpdate,
          allowMultiple: doc.IsAllowedMultiple,
          allowDelete: doc.IsAllowedDelete,
          isRequired: doc.IsRequired,
        };

        entities[categoryId].children.push(docId);

        doc.SubDocuments?.forEach((sub: SubDocument) => {
          const subId = `${docId}-${sub.DocumentId}`;

          entities[subId] = {
            id: subId,
            parentId: String(docId), //doc.DocumentId,
            type: 'subdocument',
            label: sub.DocumentName,
            documentIndexId: sub.DocumentIndex,
            allowedFileExtensions: category.AllowedFileExtensions,
            doesExist: category.DoesExist || true,
            children: [],
            allowUpdate: sub.IsAllowedUpdate,
            allowMultiple: sub.IsAllowedMultiple,
            allowDelete: sub.IsAllowedDelete,
            isRequired: doc.IsRequired,
          };

          entities[docId].children.push(subId);
        });
      });
    });

    return { entities, rootIds };
  };
  const [{ entities, rootIds }, setStore] = useState(() =>
    normalize(initialDocuments)
  );

  const [activeId, setActiveId] = useState<string | null>(null);

  //ACTIVE DOCUMENT (COMMON SHAPE FOR ALL LEVELS)

  const activeDocument = useMemo<DocumentNode | null>(() => {
    return activeId ? (entities[activeId] ?? null) : null;
  }, [activeId, entities]);

  //O(1) MUTATOR (UNCHANGED LOGIC)

  const mutate = useCallback(
    (updater: (node: DocumentNode) => void) => {
      if (!activeId) return;

      setStore((prev) => {
        const node = prev.entities[activeId];
        if (!node) return prev;

        const updatedNode = { ...node };
        updater(updatedNode);

        return {
          ...prev,
          entities: {
            ...prev.entities,
            [activeId]: updatedNode,
          },
        };
      });
    },
    [activeId]
  );

  //HANDLERS (YOUR LOGIC PRESERVED)
  const { mutateAsync: uploadDocuments, isPending: documentUploadLoading } =
    useUploadDocuments();
  const handleUpload = async (files: FileWithPreview[]) => {
    if (!activeId) return;

    const actualFile = files[0].file;
    const previewUrl = files[0].preview;
    const isImage = actualFile.type?.startsWith('image/');
    mutate((node) => {
      node.file = actualFile as File;
      node.previewUrl = previewUrl;
      node.fileType = isImage ? 'image' : 'pdf';
      node.doesExist = true;
    });

    const base64 = await convertToBase64(actualFile as File);

    const res = await uploadDocuments({
      TransactionId: 'string',
      MerchantId: 'string',
      WorkItem: 'SME-0000010713-process',
      DocumentList: [
        {
          DocumentName: activeDocument?.label as string,
          // DocumentName: "Pan",
          DocumentExtension:
            actualFile?.type?.split('/')[0] === 'image' ? 'jpeg' : 'pdf',
          DocumentFile: base64.split(',')[1] as string,
        },
      ],
    });
    console.log(res);
    toast.success('Uploaded');
  };

  const handleReplace = () =>
    mutate((node) => {
      node.file = undefined;
      node.previewUrl = undefined;
    });

  const handleDelete = () =>
    mutate((node) => {
      node.file = undefined;
      node.previewUrl = undefined;
    });

  const handleSelectedDocumentNodeId = (id: string) => {
    setActiveId(id);
  };

  const handlePreview = async (documentIndexId?: string | null) => {
    if (!documentIndexId) return;

    const res = await getDocumentImage({
      // DocumentIndexId: "50027",
      DocumentIndexId: documentIndexId,
      MerchantId: 'string',
      TransactionId: 'string',
    });

    mutate((node) => {
      node.previewUrl = res.data.Result.DocContent;
      node.fileType =
        res.data.Result.CreatedByAppName === 'pdf' ? 'pdf' : 'image';
    });
  };

  // DERIVE TREE FOR UI (SCALABLE RECURSIVE)
  const buildTree = useCallback(
    (id: string): DocumentNode => {
      const node = entities[id];

      return {
        ...node,
        children: node.children.map(buildTree),
      };
    },
    [entities]
  );

  const documentsForUI = useMemo(() => {
    return rootIds.map(buildTree);
  }, [rootIds, buildTree]);


  return {
    documents: documentsForUI,
    activeDocument,
    activeIndex: activeId,
    setActiveId,
    handleUpload,
    handleReplace,
    handleDelete,
    handlePreview,
    isDocumentPreviewLoading: isPending,
    handleSelectedDocumentNodeId,
    documentUploadLoading,
  };
}
