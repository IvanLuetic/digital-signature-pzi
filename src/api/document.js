import apiConfig from './config'
import { useDocumentStore } from '@/stores/document'

export const getDocuments = async () => {
  const documentStore = useDocumentStore()
  /* const response = await apiConfig.get('/document')
  const userDocuments = response.data.data
  documentStore.documents = userDocuments */
  const testDocument = {
    file: {
      buffer: { type: 'Buffer', data: Array(1) },
      encoding: '7bit',
      fieldname: 'file',
      mimetype: 'image/jpeg',
      originalname: 'test_doc.jpeg',
      size: 103134,
      id: 3,
    },
  }
  documentStore.documents.push(testDocument)
  return
}

export const signDocument = async (document) => {
  const response = await apiConfig.post('/workout/document/sign ', document)
  const signedDocument = response.data.data
  return signedDocument
}

export const deleteDocument = async (documentId) => {
  return await apiConfig.delete('/document/:id', documentId)
}
