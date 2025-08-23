import apiConfig from './config'
import { useDocumentStore } from '@/stores/document'

export const getDocuments = async () => {
  const documentStore = useDocumentStore()
  /*   const response = await apiConfig.get('/document')
  const userDocuments = response.data.data
  documentStore.documents = userDocuments */
  return
}

export const getDocumentById = async (documentId) => {
  const response = await apiConfig.get('/document/:id', documentId)
  const document = response.data.data
  return document
}

export const signDocument = async (document) => {
  const documentStore = useDocumentStore()
  const response = await apiConfig.post('/workout/document/sign ', document)
  const signedDocument = response.data.data
  console.log('doc', signedDocument)

  documentStore.documents.push(signedDocument)

  // And if you also want to keep your test document
  const testDocument = {
    file: {
      buffer: { type: 'Buffer', data: Array(103134) },
      encoding: '7bit',
      fieldname: 'file',
      mimetype: 'image/jpeg',
      originalname: 'SECOND_DOC.JPEG',
      size: 103134,
      id: 3,
    },
  }

  documentStore.documents.push(testDocument)
  console.log('docss', documentStore.documents)

  return signedDocument
}

export const deleteDocument = async (documentId) => {
  return await apiConfig.delete('/document/:id', documentId)
}
