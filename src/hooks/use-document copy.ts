// import { useState } from 'react';
// import { toast } from 'sonner';
// import type {
//   DMSRequiredDocumentResponse,
//   NormalizedDocument,
// } from '@/types/types';
// import { convertToBase64 } from '@/utils/helper';

// // Normalized document type for consistent handling

// export function useDocument(initialDocuments: DMSRequiredDocumentResponse) {
//   const [activeId, setActiveId] = useState<string>('');

//   // this document index is used to call the document base 64

//   // Normalize documents by inheriting flags from parent to children
//   const normalizeDocuments = (
//     docs: DMSRequiredDocumentResponse
//   ): DMSRequiredDocumentResponse => {
//     return docs.map((category) => ({
//       ...category,
//       Documents: category.Documents?.map((doc) => {
//         // If doc has SubDocuments, inherit flags to them
//         if (doc.SubDocuments && Array.isArray(doc.SubDocuments)) {
//           return {
//             ...doc,
//             SubDocuments: doc.SubDocuments.map((subDoc) => ({
//               ...subDoc,
//               // Inherit parent flags if not explicitly set
//               IsAllowedMultiple:
//                 subDoc.IsAllowedMultiple ?? doc.IsAllowedMultiple,
//               IsAllowedUpdate: subDoc.IsAllowedUpdate ?? doc.IsAllowedUpdate,
//             })),
//           };
//         }

//         return doc;
//       }),
//     }));
//   };

//   const [documents, setDocuments] = useState<DMSRequiredDocumentResponse>(
//     normalizeDocuments(initialDocuments)
//   );

//   // Normalize a document to common structure
//   const normalizeDocumentData = (
//     doc: any,
//     categoryId: string,
//     categoryLabel: string,
//     allowedFileExtensions?: string[],
//     parentId?: number,
//     parentLabel?: string
//   ): NormalizedDocument => {

//     // if parentId presnet that means its a subdocument
//     if (parentId) {
//       // SubDocument structure
//       return {
//         id: `${categoryId}-${parentId}-${doc.DocumentId}`,
//         documentId: doc.DocumentId,
//         label: doc.DocumentName,
//         documentIndex: doc.DocumentIndex,
//         allowMultiple: doc.IsAllowedMultiple ?? doc.IsAllowedMultiple ?? true,
//         allowUpdate: doc.IsAllowedUpdate ?? doc.IsAllowedUpdate ?? true,
//         allowDelete: true,
//         isRequired: false,
//         categoryId,
//         categoryLabel,
//         parentId,
//         parentLabel,
//         file: doc.file,
//         files: doc.files,
//         previewUrl: doc.previewUrl,
//         type: doc.type,
//         doesExist: doc.DoesExist,
//         allowedFileExtensions: allowedFileExtensions as string[],
//         _original: doc,
//       };
//     } else {
//       // Document structure
//       return {
//         id: `${categoryId}-${doc.DocumentId}`,
//         documentId: doc.DocumentId,
//         documentIndex: doc.DocumentIndex,
//         label: doc.DocumentName,
//         allowMultiple: doc.IsAllowedMultiple ?? true,
//         allowUpdate: doc.IsAllowedUpdate ?? true,
//         allowDelete: true,
//         isRequired: doc.IsRequired ?? false,
//         categoryId,
//         categoryLabel,
//         createdBy: doc.CreatedBy,
//         createdDate: doc.CreatedDate,
//         file: doc.file,
//         files: doc.files,
//         previewUrl: doc.previewUrl,
//         doesExist: true,
//         type: doc.type,
//         allowedFileExtensions: allowedFileExtensions as string[],
//         _original: doc,
//       };
//     }
//   };

//   // Helper: Find a document at any level by id
//   const findDocumentById = (
//     docs: DMSRequiredDocumentResponse,
//     targetId: string
//   ): NormalizedDocument | null => {
//     let allowedFileExtensions: string[] = [];
//     for (const category of docs) {
//       if (!category.AllowedFileExtensions) {
//         continue;
//       }
//       allowedFileExtensions = [...category.AllowedFileExtensions];
//     }
//     for (const category of docs) {
//       if (!category.Documents) continue;

//       for (const doc of category.Documents) {
//         const docId = `${category.Id}-${doc.DocumentId}`;

//         // Check if this is the target document (level 1)
//         if (docId === targetId) {
//           return normalizeDocumentData(
//             doc,
//             category.Id,
//             category.DocumentName,
//             allowedFileExtensions
//           );
//         }

//         // Check SubDocuments (level 2)
//         if (doc.SubDocuments && Array.isArray(doc.SubDocuments)) {
//           for (const subDoc of doc.SubDocuments) {
//             const subDocId = `${category.Id}-${doc.DocumentId}-${subDoc.DocumentId}`;

//             if (subDocId === targetId) {
//               return normalizeDocumentData(
//                 subDoc,
//                 category.Id,
//                 category.DocumentName,
//                 allowedFileExtensions,
//                 doc.DocumentId,
//                 doc.DocumentName
//               );
//             }
//           }
//         }
//       }
//     }

//     return null;
//   };

//   const activeDocument = activeId
//     ? findDocumentById(documents, activeId)
//     : null;

//   const handleSelectDocument = (document: any) => {
//     // Document can be pre-normalized from DocumentStrip or just an ID
//     if (typeof document === 'string') {
//       setActiveId(document);
//     } else if (document?.id) {
//       setActiveId(document.id);
//     }
//   };

//   const handleUpload = async (files: any[]) => {
//     if (!files || !activeDocument) {
//       toast.error('Please select a document first');
//       return;
//     }

//     const file = files[0].file || files[0];
//     const isImage = file.type?.startsWith('image/');
//     const previewUrl = await convertToBase64(file);

//     // Update documents immutably
//     const updatedDocuments = documents.map((category) => {
//       if (category.Id !== activeDocument.categoryId) {
//         return category;
//       }

//       return {
//         ...category,
//         Documents: category.Documents?.map((doc) => {
//           // Level 1: Direct document match
//           if (
//             doc.DocumentId === activeDocument.documentId &&
//             !activeDocument.parentId
//           ) {
//             return {
//               ...doc,
//               file,
//               files: activeDocument.allowMultiple
//                 ? [...((doc as any).files || []), file]
//                 : [file],
//               previewUrl,
//               type: isImage ? 'image' : 'pdf',
//             };
//           }

//           // Level 2: SubDocument match
//           if (doc.SubDocuments && Array.isArray(doc.SubDocuments)) {
//             if (doc.DocumentId === activeDocument.parentId) {
//               return {
//                 ...doc,
//                 SubDocuments: doc.SubDocuments.map((subDoc) => {
//                   if (subDoc.DocumentId === activeDocument.documentId) {
//                     return {
//                       ...subDoc,
//                       file,
//                       files: activeDocument.allowMultiple
//                         ? [...((subDoc as any).files || []), file]
//                         : [file],
//                       previewUrl,
//                       type: isImage ? 'image' : 'pdf',
//                     };
//                   }
//                   return subDoc;
//                 }),
//               };
//             }
//           }

//           return doc;
//         }),
//       };
//     });

//     setDocuments(updatedDocuments);
//     toast.success(`${activeDocument.label} uploaded successfully`);
//   };

//   const handleReplace = () => {
//     if (!activeDocument) {
//       toast.error('No active document selected');
//       return;
//     }

//     // Check if replacement is allowed
//     if (activeDocument.allowUpdate === false) {
//       toast.error('Update is not allowed for this document');
//       return;
//     }

//     // // Revoke old preview URL to prevent memory leaks
//     // if (activeDocument.previewUrl) {
//     //   URL.revokeObjectURL(activeDocument.previewUrl);
//     // }

//     const updatedDocuments = documents.map((category) => {
//       if (category.Id !== activeDocument.categoryId) {
//         return category;
//       }

//       return {
//         ...category,
//         Documents: category.Documents?.map((doc) => {
//           // Level 1: Direct document
//           if (
//             doc.DocumentId === activeDocument.documentId &&
//             !activeDocument.parentId
//           ) {
//             return {
//               ...doc,
//               file: undefined,
//               files: undefined,
//               previewUrl: undefined,
//               type: undefined,
//             };
//           }

//           // Level 2: SubDocument
//           if (doc.SubDocuments && Array.isArray(doc.SubDocuments)) {
//             if (doc.DocumentId === activeDocument.parentId) {
//               return {
//                 ...doc,
//                 SubDocuments: doc.SubDocuments.map((subDoc) => {
//                   if (subDoc.DocumentId === activeDocument.documentId) {
//                     return {
//                       ...subDoc,
//                       file: undefined,
//                       files: undefined,
//                       previewUrl: undefined,
//                       type: undefined,
//                     };
//                   }
//                   return subDoc;
//                 }),
//               };
//             }
//           }

//           return doc;
//         }),
//       };
//     });

//     setDocuments(updatedDocuments);
//     toast.success('Document cleared successfully');
//   };

//   const handleDelete = () => {
//     if (!activeDocument) {
//       toast.error('No active document selected');
//       return;
//     }

//     // Check if deletion is allowed
//     if (activeDocument.allowDelete === false) {
//       toast.error('Delete is not allowed for this document');
//       return;
//     }

//     // If multiple files are allowed and we have files, delete specific file
//     if (activeDocument.allowMultiple && activeDocument.files) {
//       const updatedDocuments = documents.map((category) => {
//         if (category.Id !== activeDocument.categoryId) {
//           return category;
//         }

//         return {
//           ...category,
//           Documents: category.Documents?.map((doc) => {
//             // Level 1: Direct document
//             if (
//               doc.DocumentId === activeDocument.documentId &&
//               !activeDocument.parentId
//             ) {
//               return {
//                 ...doc,
//                 files: undefined,
//                 file: undefined,
//                 previewUrl: undefined,
//               };
//             }

//             // Level 2: SubDocument
//             if (doc.SubDocuments && Array.isArray(doc.SubDocuments)) {
//               if (doc.DocumentId === activeDocument.parentId) {
//                 return {
//                   ...doc,
//                   SubDocuments: doc.SubDocuments.map((subDoc) => {
//                     if (subDoc.DocumentId === activeDocument.documentId) {
//                       return {
//                         ...subDoc,
//                         files: undefined,
//                         file: undefined,
//                         previewUrl: undefined,
//                       };
//                     }
//                     return subDoc;
//                   }),
//                 };
//               }
//             }

//             return doc;
//           }),
//         };
//       });

//       setDocuments(updatedDocuments);
//       toast.success('File deleted successfully');
//     } else {
//       // Delete all files (same as replace)
//       if (activeDocument.previewUrl) {
//         URL.revokeObjectURL(activeDocument.previewUrl);
//       }
//       handleReplace();
//     }
//   };

//   return {
//     documents,
//     activeDocument,
//     activeIndex: activeId,
//     handleSelectDocument,
//     handleUpload,
//     handleReplace,
//     handleDelete,
//     setActiveId,
//   };
// }

// import { useState, useCallback } from 'react';
// import { toast } from 'sonner';
// import type {
//   DMSRequiredDocumentResponse,
//   NormalizedDocument,
// } from '@/types/types';
// import { convertToBase64 } from '@/utils/helper';
// import type { FileWithPreview } from './use-file-upload';
// import { useGetDocumentImage } from '@/services/hooks/use-documents';

// // Normalized document type for consistent handling

// export function useDocument(initialDocuments: DMSRequiredDocumentResponse) {
//   const { mutateAsync: getDocumentImage, isPending: isDocumentPreviewLoading } =
//     useGetDocumentImage();
//   const [activeId, setActiveId] = useState<string>('');

//   // this document index is used to call the document base 64

//   // Normalize documents to inherits parent flags to subdocuments
//   // const normalizeDocuments = (
//   //   docs: DMSRequiredDocumentResponse
//   // ): DMSRequiredDocumentResponse => {
//   //   return docs.map((category) => ({
//   //     ...category,
//   //     Documents: category.Documents?.map((doc) => {
//   //       // If doc has SubDocuments, inherit flags to them
//   //       if (doc.SubDocuments && Array.isArray(doc.SubDocuments)) {
//   //         return {
//   //           ...doc,
//   //           SubDocuments: doc.SubDocuments.map((subDoc) => ({
//   //             ...subDoc,
//   //             // Inherit parent flags if not explicitly set
//   //             IsAllowedMultiple:
//   //               subDoc.IsAllowedMultiple ?? doc.IsAllowedMultiple,
//   //             IsAllowedUpdate: subDoc.IsAllowedUpdate ?? doc.IsAllowedUpdate,
//   //           })),
//   //         };
//   //       }

//   //       return doc;
//   //     }),
//   //   }));
//   // };

//   const [documents, setDocuments] =
//     useState<DMSRequiredDocumentResponse>(initialDocuments);

//   // Normalize a document to common structure for easy handling and for o(1) space complexity
//   const normalizeDocumentData = (
//     doc: any,
//     categoryId: string,
//     categoryLabel: string,
//     allowedFileExtensions?: string[],
//     parentId?: number,
//     parentLabel?: string
//   ): NormalizedDocument => {
//     // if parentId present that means its a subdocument
//     // if parentId present that means its a subdocument
//     if (parentId) {
//       // SubDocument structure
//       return {
//         id: `${categoryId}-${parentId}-${doc.DocumentId}`,
//         documentId: doc.DocumentId,
//         label: doc.DocumentName,
//         documentIndex: doc.DocumentIndex,
//         allowMultiple: doc.IsAllowedMultiple ?? doc.IsAllowedMultiple ?? true,
//         allowUpdate: doc.IsAllowedUpdate ?? doc.IsAllowedUpdate ?? true,
//         allowDelete: true,
//         isRequired: false,
//         categoryId,
//         categoryLabel,
//         parentId,
//         parentLabel,
//         file: doc.file,
//         files: doc.files,
//         previewUrl: doc.previewUrl,
//         type: doc.type,
//         doesExist: doc.doesExist || true,
//         allowedFileExtensions: allowedFileExtensions as string[],
//         _original: doc,
//       };
//     } else {
//       // Document structure
//       return {
//         id: `${categoryId}-${doc.DocumentId}`,
//         documentId: doc.DocumentId,
//         documentIndex: doc.DocumentIndex,
//         label: doc.DocumentName,
//         allowMultiple: doc.IsAllowedMultiple ?? true,
//         allowUpdate: doc.IsAllowedUpdate ?? true,
//         allowDelete: true,
//         isRequired: doc.IsRequired ?? false,
//         categoryId,
//         categoryLabel,
//         createdBy: doc.CreatedBy,
//         createdDate: doc.CreatedDate,
//         file: doc.file,
//         files: doc.files,
//         previewUrl: doc.previewUrl,
//         doesExist: doc.doesExist || true,
//         type: doc.type,
//         allowedFileExtensions: allowedFileExtensions as string[],
//         _original: doc,
//       };
//     }
//   };

//   /**
//    *
//    * @param docs
//    * @param targetId
//    * @returns flatten documents
//    * Traverse to the actual documents with that index id (Kind of binary search)
//    */
//   const traverseDocuments = (
//     docs: DMSRequiredDocumentResponse,
//     targetId: string
//   ): NormalizedDocument | null => {
//     let allowedFileExtensions: string[] = [];

//     for (const category of docs) {
//       allowedFileExtensions = category.AllowedFileExtensions as string[];

//       if (!category.Documents) break;

//       for (const doc of category.Documents) {
//         const docId = `${category.Id}-${doc.DocumentId}`;

//         if (docId === targetId) {
//           return normalizeDocumentData(
//             doc,
//             category.Id,
//             category.DocumentName,
//             allowedFileExtensions
//           );
//         }

//         if (doc.SubDocuments && Array.isArray(doc.SubDocuments)) {
//           for (const subDoc of doc.SubDocuments) {
//             const subDocId = `${category.Id}-${doc.DocumentId}-${subDoc.DocumentId}`;

//             if (subDocId === targetId) {
//               return normalizeDocumentData(
//                 subDoc,
//                 category.Id,
//                 category.DocumentName,
//                 allowedFileExtensions,
//                 doc.DocumentId,
//                 doc.DocumentName
//               );
//             }
//           }
//         }
//       }
//     }

//     return null;
//   };

//   /**
//    * Get active document
//    * this will mapped in the ui
//    */
//   const activeDocument = activeId
//     ? traverseDocuments(documents, activeId)
//     : null;

//   /**
//    *
//    * @param selctedIndex
//    * this function will set ActiveId which helps to traverse to the document
//    */
//   const handleSelectedDocumentNodeId = (selectedIndex: string) => {
//     console.log(selectedIndex);
//     if (typeof selectedIndex === 'string') {
//       setActiveId(selectedIndex);
//     }
//   };

//   const handleUpload = async (file: FileWithPreview[]) => {
//     if (!activeDocument) {
//       toast.error('Please select a document first');
//       return;
//     }

//     const actualFile = file[0].file;
//     const isImage = actualFile.type?.startsWith('image/');
//     // const previewUrl = await convertToBase64(actualFile as File);
//     const previewUrl = file[0].preview as string;

//     // Update documents immutably
//     const updatedDocuments = documents.map((category) => {
//       if (category.Id !== activeDocument.categoryId) {
//         return category;
//       }

//       return {
//         ...category,
//         Documents: category.Documents?.map((doc) => {
//           // Level 1: Direct document match
//           if (
//             doc.DocumentId === activeDocument?.documentId &&
//             !activeDocument.parentId
//           ) {
//             return {
//               ...doc,
//               doesExist: true,
//               file,
//               previewUrl,
//               type: isImage ? 'image' : 'pdf',
//             };
//           }

//           // Level 2: SubDocument match
//           if (doc.SubDocuments && Array.isArray(doc.SubDocuments)) {
//             if (doc.DocumentId === activeDocument.parentId) {
//               return {
//                 ...doc,
//                 SubDocuments: doc.SubDocuments.map((subDoc) => {
//                   if (subDoc.DocumentId === activeDocument.documentId) {
//                     return {
//                       ...subDoc,
//                       doesExist: true,
//                       file,
//                       previewUrl,
//                       type: isImage ? 'image' : 'pdf',
//                     };
//                   }
//                   return subDoc;
//                 }),
//               };
//             }
//           }

//           return doc;
//         }),
//       };
//     });

//     setDocuments(updatedDocuments);
//     toast.success(`${activeDocument.label} uploaded successfully`);
//   };

//   const handleReplace = () => {
//     if (!activeDocument) {
//       toast.error('No active document selected');
//       return;
//     }

//     // Check if replacement is allowed
//     if (activeDocument.allowUpdate === false) {
//       toast.error('Update is not allowed for this document');
//       return;
//     }

//     const updatedDocuments = documents.map((category) => {
//       if (category.Id !== activeDocument.categoryId) {
//         return category;
//       }

//       return {
//         ...category,
//         Documents: category.Documents?.map((doc) => {
//           // Level 1: Direct document
//           if (
//             doc.DocumentId === activeDocument.documentId &&
//             !activeDocument.parentId
//           ) {
//             return {
//               ...doc,
//               file: undefined,
//               files: undefined,
//               previewUrl: undefined,
//               type: undefined,
//             };
//           }

//           // Level 2: SubDocument
//           if (doc.SubDocuments && Array.isArray(doc.SubDocuments)) {
//             if (doc.DocumentId === activeDocument.parentId) {
//               return {
//                 ...doc,
//                 SubDocuments: doc.SubDocuments.map((subDoc) => {
//                   if (subDoc.DocumentId === activeDocument.documentId) {
//                     return {
//                       ...subDoc,
//                       file: undefined,
//                       files: undefined,
//                       previewUrl: undefined,
//                       type: undefined,
//                     };
//                   }
//                   return subDoc;
//                 }),
//               };
//             }
//           }

//           return doc;
//         }),
//       };
//     });

//     setDocuments(updatedDocuments);
//     toast.success('Document cleared successfully');
//   };

//   const handleDelete = () => {
//     if (!activeDocument) {
//       toast.error('No active document selected');
//       return;
//     }

//     // Check if deletion is allowed
//     if (activeDocument.allowDelete === false) {
//       toast.error('Delete is not allowed for this document');
//       return;
//     }

//     // If multiple files are allowed and we have files, delete specific file
//     if (activeDocument.allowMultiple && activeDocument.files) {
//       const updatedDocuments = documents.map((category) => {
//         if (category.Id !== activeDocument.categoryId) {
//           return category;
//         }

//         return {
//           ...category,
//           Documents: category.Documents?.map((doc) => {
//             // Level 1: Direct document
//             if (
//               doc.DocumentId === activeDocument.documentId &&
//               !activeDocument.parentId
//             ) {
//               return {
//                 ...doc,
//                 files: undefined,
//                 file: undefined,
//                 previewUrl: undefined,
//               };
//             }

//             // Level 2: SubDocument
//             if (doc.SubDocuments && Array.isArray(doc.SubDocuments)) {
//               if (doc.DocumentId === activeDocument.parentId) {
//                 return {
//                   ...doc,
//                   SubDocuments: doc.SubDocuments.map((subDoc) => {
//                     if (subDoc.DocumentId === activeDocument.documentId) {
//                       return {
//                         ...subDoc,
//                         files: undefined,
//                         file: undefined,
//                         previewUrl: undefined,
//                       };
//                     }
//                     return subDoc;
//                   }),
//                 };
//               }
//             }

//             return doc;
//           }),
//         };
//       });

//       setDocuments(updatedDocuments);
//       toast.success('File deleted successfully');
//     } else {
//       // Delete all files (same as replace)
//       if (activeDocument.previewUrl) {
//         URL.revokeObjectURL(activeDocument.previewUrl);
//       }
//       handleReplace();
//     }
//   };

//  const handlePreview = async (documentIndex: string | undefined | null) => {
//   if (!documentIndex) return;

//   try {
//     const apiResponse = await getDocumentImage({
//       DocumentIndexId: documentIndex,
//       MerchantId: 'string',
//       TransactionId: 'string',
//     });

//     const updatedDocuments = documents.map((category) => ({
//       ...category,
//       Documents: category.Documents?.map((doc) => {
//         // Check if current document matches
//         if (doc.DocumentIndex === documentIndex) {
//           return {
//             ...doc,
//             previewUrl: apiResponse.data.Result.DocContent,
//             type: apiResponse.data.Result.CreatedByAppName === "pdf" ? "pdf" : "image",
//           };
//         }

//         // Check subdocuments
//         if (doc.SubDocuments && Array.isArray(doc.SubDocuments)) {
//           return {
//             ...doc,
//             SubDocuments: doc.SubDocuments.map((subDoc) => {
//               if (subDoc.DocumentIndex === documentIndex) {
//                 return {
//                   ...subDoc,
//                   previewUrl: apiResponse.data.Result.DocContent,
//                   type: apiResponse.data.Result.CreatedByAppName === "pdf" ? "pdf" : "image",
//                 };
//               }
//               return subDoc;
//             }),
//           };
//         }

//         return doc;
//       }),
//     }));

//     console.log("updatedDocuments", updatedDocuments);
//     setDocuments(updatedDocuments);
//   } catch (error) {
//     console.error('Preview fetch failed:', error);
//     toast.error('Failed to load document preview');
//   }
// };
//   return {
//     documents,
//     activeDocument,
//     activeIndex: activeId,
//     handleSelectedDocumentNodeId,
//     handleUpload,
//     handleReplace,
//     handleDelete,
//     setActiveId,
//     handlePreview,
//     isDocumentPreviewLoading,
//   };
// }

import { useState, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import type {
  DMSRequiredDocumentResponse,
  NormalizedDocument,
} from '@/types/types';
import type { FileWithPreview } from './use-file-upload';
import { useGetDocumentImage } from '@/services/hooks/use-documents';

export function useDocument(initialDocuments: DMSRequiredDocumentResponse) {
  const { mutateAsync: getDocumentImage, isPending: isDocumentPreviewLoading } =
    useGetDocumentImage();

  const [documents, setDocuments] =
    useState<DMSRequiredDocumentResponse>(initialDocuments);

  const [activeId, setActiveId] = useState<string>('');

  //Normalize helper

  const normalizeDocumentData = (
    doc: any,
    categoryId: string,
    categoryLabel: string,
    allowedFileExtensions?: string[],
    parentId?: number,
    parentLabel?: string
  ): NormalizedDocument => {
    return {
      id: parentId
        ? `${categoryId}-${parentId}-${doc.DocumentId}`
        : `${categoryId}-${doc.DocumentId}`,
      documentId: doc.DocumentId,
      documentIndex: doc.DocumentIndex,
      label: doc.DocumentName,
      allowMultiple: doc.IsAllowedMultiple ?? true,
      allowUpdate: doc.IsAllowedUpdate ?? true,
      allowDelete: true,
      isRequired: doc.IsRequired ?? false,
      categoryId,
      categoryLabel,
      parentId,
      parentLabel,
      file: doc.file,
      files: doc.files,
      previewUrl: doc.previewUrl,
      type: doc.type,
      doesExist: doc.doesExist ?? true,
      allowedFileExtensions: allowedFileExtensions as string[],
      _original: doc,
    };
  };

  //Traverse tree (find active)
  const traverseDocuments = useCallback(
    (
      docs: DMSRequiredDocumentResponse,
      targetId: string
    ): NormalizedDocument | null => {
      for (const category of docs) {
        const allowedFileExtensions =
          category.AllowedFileExtensions as string[];

        if (!category.Documents) continue;

        for (const doc of category.Documents) {
          const docId = `${category.Id}-${doc.DocumentId}`;

          if (docId === targetId) {
            return normalizeDocumentData(
              doc,
              category.Id,
              category.DocumentName,
              allowedFileExtensions
            );
          }

          if (doc.SubDocuments) {
            for (const subDoc of doc.SubDocuments) {
              const subId = `${category.Id}-${doc.DocumentId}-${subDoc.DocumentId}`;

              if (subId === targetId) {
                return normalizeDocumentData(
                  subDoc,
                  category.Id,
                  category.DocumentName,
                  allowedFileExtensions,
                  doc.DocumentId,
                  doc.DocumentName
                );
              }
            }
          }
        }
      }

      return null;
    },
    []
  );

  const activeDocument = useMemo(
    () => (activeId ? traverseDocuments(documents, activeId) : null),
    [documents, activeId, traverseDocuments]
  );

  //COMMON TREE UPDATER (MAIN REFACTOR)
  const updateDocumentNode = useCallback(
    (updater: (node: any) => any) => {
      if (!activeDocument) return documents;

      return documents.map((category) => {
        if (category.Id !== activeDocument.categoryId) return category;

        return {
          ...category,
          Documents: category.Documents?.map((doc) => {
            // level 1
            if (
              doc.DocumentId === activeDocument.documentId &&
              !activeDocument.parentId
            ) {
              return updater(doc);
            }

            // level 2
            if (
              doc.SubDocuments &&
              doc.DocumentId === activeDocument.parentId
            ) {
              return {
                ...doc,
                SubDocuments: doc.SubDocuments.map((subDoc) =>
                  subDoc.DocumentId === activeDocument.documentId
                    ? updater(subDoc)
                    : subDoc
                ),
              };
            }

            return doc;
          }),
        };
      });
    },
    [documents, activeDocument]
  );

  //Handlers (NOW SUPER CLEAN)

  const handleSelectedDocumentNodeId = (id: string) => {
    setActiveId(id);
  };

  /* ---------- Upload ---------- */

  const handleUpload = async (files: FileWithPreview[]) => {
    if (!activeDocument) {
      toast.error('Please select a document first');
      return;
    }

    const actualFile = files[0].file;
    const previewUrl = files[0].preview;
    const isImage = actualFile.type?.startsWith('image/');

    const updated = updateDocumentNode((node) => ({
      ...node,
      doesExist: true,
      file: files,
      previewUrl,
      type: isImage ? 'image' : 'pdf',
    }));

    setDocuments(updated);
    toast.success(`${activeDocument.label} uploaded successfully`);
  };

  /* ---------- Replace ---------- */

  const handleReplace = () => {
    if (!activeDocument) return;

    if (activeDocument.allowUpdate === false) {
      toast.error('Update is not allowed');
      return;
    }

    const updated = updateDocumentNode((node) => ({
      ...node,
      file: undefined,
      files: undefined,
      previewUrl: undefined,
      type: undefined,
    }));

    setDocuments(updated);
  };

  /* ---------- Delete ---------- */

  const handleDelete = () => {
    if (!activeDocument) return;

    const updated = updateDocumentNode((node) => ({
      ...node,
      file: undefined,
      files: undefined,
      previewUrl: undefined,
    }));

    setDocuments(updated);
  };

  /* ---------- Preview ---------- */

  const handlePreview = async (documentIndex?: string | null) => {
    if (!documentIndex) return;

    try {
      const res = await getDocumentImage({
        DocumentIndexId: documentIndex,
        MerchantId: 'string',
        TransactionId: 'string',
      });

      const updated = updateDocumentNode((node) => ({
        ...node,
        previewUrl: res.data.Result.DocContent,
        type: res.data.Result.CreatedByAppName === 'pdf' ? 'pdf' : 'image',
      }));

      setDocuments(updated);
    } catch {
      toast.error('Failed to load document preview');
    }
  };

  /* ========================================================= */

  return {
    documents,
    activeDocument,
    activeIndex: activeId,
    handleSelectedDocumentNodeId,
    handleUpload,
    handleReplace,
    handleDelete,
    handlePreview,
    setActiveId,
    isDocumentPreviewLoading,
  };
}