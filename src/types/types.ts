export type DocumentStatus = "pending" | "uploaded";

// export interface DMSDocument {
//   id: string;
//   name: string;
//   required: boolean;
//   status: DocumentStatus;
//   file?: File;
//   previewUrl?: string; // For images
//   type?: "image" | "pdf" | "other";
// }

export interface DocumentRequestType {
  TransactionId: string;
  MerchantId: string;
  ProcessInstanceId: string;
}

export interface DocumentImageRequestType {
  TransactionId: string;
  MerchantId: string;
  DocumentIndexId: string;
}

// document upload types
export interface UploadDocumentList {
  DocumentName: string
  DocumentExtension: string
  DocumentFile: string
  DocumentRemarks: string
}
export interface UploadDocumentRequestType {
  TransactionId: string
  MerchantId: string
  WorkItem: string
  DocumentList: UploadDocumentList[]
}

// export type DMSRequiredDocumentResponse = {
//   data: DMSRequiredDocument[];
//   documents: Record<string, any>;
// }
export type DMSRequiredDocumentResponse = DMSRequiredDocument[]
export interface DMSRequiredDocument {
  Id: string
  DocumentName: string
  IsRequired: boolean
  DoesExist: any
  IsAllowedUpdate: boolean
  IsAllowedMultiple: boolean
  MandaryDocumentsCount: number
  AllowedFileExtensions: string[]
  Documents: Document[]
  CreatedBy: string
  CreatedDate: string
}

export interface Document {
  DocumentId: number
  DocumentName: string
  DocumentIndex: string
  IsAllowedMultiple: boolean
  IsAllowedUpdate: boolean
  IsAllowedDelete: boolean
  IsRequired: boolean
  CreatedBy: string
  CreatedDate: string
  Remarks: string
  DoesExist: boolean
  SubDocuments?: SubDocument[]
}

export interface SubDocument {
  DocumentId: number
  DocumentName: string
  DocumentIndex: string
  IsAllowedMultiple: boolean
  IsAllowedUpdate: boolean
  IsRequired: boolean
  IsAllowedDelete: boolean
  CreatedBy: string
  CreatedDate: string
  Remarks: string
  DoesExist: boolean
}


export interface ActiveDocument {
  DocumentId: number
  SubDocumentName: string
  FileId: string
  IsAllowedMultiple: boolean
  IsAllowedUpdate: boolean
  IsAllowedDelete: boolean
  IsRequired: boolean
  CreatedBy: string
  CreatedDate: string
  SubDocuments: any
  categoryId: string
  categoryLabel: string
}

export interface NormalizedDocument {
  id: string;
  documentId: number;
  label: string;
  fileId?: string;
  documentIndex?: string;
  allowMultiple: boolean;
  allowUpdate: boolean;
  allowDelete: boolean;
  isRequired: boolean;
  categoryId: string;
  categoryLabel: string;
  parentId?: number;
  parentLabel?: string;
  createdBy?: string;
  createdDate?: string;
  file?: File;
  files?: File[];
  previewUrl?: string;
  doesExist?: boolean;
  type?: 'image' | 'pdf';
  // Original data for reference
  allowedFileExtensions: string[];
  _original?: Document | SubDocument;
}

/**
 * Document Image Retrive from the Apis
 * Types that are Responsed form the server while retrieving the document image
 */

export interface DocumentImageResponse {
  Response: DocumentImageResponseStatus
  Result: DocumentImageResult
}

export interface DocumentImageResponseStatus {
  ResponseCode: string
  ResponseMessage: string
}

export interface DocumentImageResult {
  CreatedByAppName: string
  DocContent: string
  DocumentName: string
  DocumentSize: string
  DocumentType: string
  Message: string
  StatusCode: string
}


// tree types
export interface RootNodeTree {
  id: string
  label: string
  children: ChildNode[]
}

export interface ChildNode {
  DocumentId: number
  DocumentName: string
  DocumentIndex: string
  IsAllowedMultiple: boolean
  IsAllowedUpdate: boolean
  IsAllowedDelete: boolean
  IsRequired?: boolean
  CreatedBy: string
  CreatedDate: string
  Children?: SubDocument[]
}

export interface SubChilNode {
  DocumentId: number
  DocumentName: string
  DocumentIndex: string
  IsAllowedMultiple: boolean
  IsAllowedUpdate: boolean
  IsAllowedDelete: boolean
  CreatedBy: string
  CreatedDate: string
}
