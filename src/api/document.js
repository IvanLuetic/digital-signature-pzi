import apiConfig from './config'
import { useDocumentStore } from '@/stores/document'

export const getDocuments = async () => {
  const documentStore = useDocumentStore()

  const mockDocuments = [
    {
      id: 1,
      title: 'Employment Contract - Software Developer',
      signedDate: '2024-08-10',
      documentType: 'Contract',
      status: 'completed',
      fileSize: '2.4 MB',
    },
    {
      id: 2,
      title: 'Non-Disclosure Agreement - Project Alpha',
      signedDate: '2024-08-05',
      documentType: 'NDA',
      status: 'completed',
      fileSize: '1.2 MB',
    },
    {
      id: 3,
      title: 'Service Agreement - Q3 2024',
      signedDate: '2024-07-28',
      documentType: 'Agreement',
      status: 'completed',
      fileSize: '3.1 MB',
    },
    {
      id: 4,
      title: 'Privacy Policy Acknowledgment',
      signedDate: '2024-07-15',
      documentType: 'Policy',
      status: 'completed',
      fileSize: '856 KB',
    },
    {
      id: 5,
      title: 'Vendor Agreement - TechCorp',
      signedDate: '2024-06-20',
      documentType: 'Agreement',
      status: 'completed',
      fileSize: '1.8 MB',
    },
  ]

  documentStore.documents = mockDocuments
  /* return await apiConfig.get('/documents') */
}

export const signDocument = async (document) => {
  return await apiConfig.post('/documents/sign', document)
}
