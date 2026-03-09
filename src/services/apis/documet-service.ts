// import type { DocumentImageRequestType, DocumentRequestType } from '@/types/types';
import type { DocumentImageRequestType, DocumentRequestType, UploadDocumentRequestType } from '@/types/types';
import axiosInstance from '../axiosInstance';

//  const getDocumentsDetails = () => {
//   return axiosInstance.get('/data');
// };
const getDocumentsDetails = (payload: DocumentRequestType) => {
  return axiosInstance.post('/FetchDocument/DocumentDetails', payload);
};

const getDocumentImage = (payload: DocumentImageRequestType) => {
  return axiosInstance.post('/BPM/downloaddocuments', payload)
}


// upload documents 
const uploadDocuments = (payload: UploadDocumentRequestType) => {
  return axiosInstance.post('/Client/PushData', payload)
}

export { getDocumentsDetails, getDocumentImage, uploadDocuments };
