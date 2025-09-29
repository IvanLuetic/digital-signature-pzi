import apiConfig from './config'
import { useDocumentStore } from '@/stores/document'

export const getDocuments = async () => {
  const documentStore = useDocumentStore()
  const response = await apiConfig.get('/document')
  console.log(response.data)
  const userDocuments = response.data.data
  documentStore.documents = userDocuments
  /* const testDocument = {
    file: {
      buffer: { type: 'Buffer', data: Array(1) },
      encoding: '7bit',
      fieldname: 'file',
      mimetype: 'image/jpeg',
      original_name: 'test_doc.jpeg',
      signed_at: '2024-06-30:35:12',
      size: '693kb',
      id: 3,
    },
  }
  documentStore.documents.push(testDocument) */
  return
}

export const signDocument = async (formData) => {
  return await apiConfig.post('/document/sign ', formData)
}

export const getDocument = async (id) => {
  const response = await apiConfig.get(`/document/${id}`, {
    responseType: 'arraybuffer',
  })
  console.log(response)
  return response
}

export const downloadDocument = async (id) => {
  return await apiConfig.get(`/document/download/${id}`, {
    responseType: 'blob',
  })
}

export const verifyDocument = async (document) => {
  return await apiConfig.post(`/document/checker/`, document)
}

export const deleteDocument = async (documentId) => {
  return await apiConfig.delete(`/document/${documentId}`)
}

export const getPublicKeys = async () => {
  return await apiConfig.get('/pgp')
}
