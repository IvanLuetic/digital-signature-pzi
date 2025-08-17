import apiConfig from './config'
import { useDocumentStore } from '@/stores/document'

export const getDocuments = async () => {
  const documentStore = useDocumentStore()

  const mockDocuments = [
    {
      id: 1,
      title: 'Employment Contract - Software Developer',
      signedDate: '2024-08-10',
    },

    {
      id: 3,
      title: 'Service Agreement - Q3 2024',
      signedDate: '2024-07-28',
    },
    {
      id: 4,
      title: 'Privacy Policy Acknowledgment',
      signedDate: '2024-07-15',
    },
    {
      id: 5,
      title: 'Vendor Agreement - TechCorp',
      signedDate: '2024-06-20',
    },
  ]

  documentStore.documents = mockDocuments
  /* return await apiConfig.get('/document') */
}

export const signDocument = async (document) => {
  const response = await apiConfig.post('/document/sign ', document)
  const signedDocument = response.data.data
  return signedDocument
}
