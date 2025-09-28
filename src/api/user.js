import apiConfig from './config'

export const editProfile = async (data) => {
  return await apiConfig.patch('/users/profile', data)
}

//admin routes
export const getUsers = async (page) => {
  const response = await apiConfig.get(`/admin/users?page=${page}`)
  return response
}

export const getUserDocuments = async (id) => {
  const response = await apiConfig.get(`/admin/users/documents/${id}`)
  const userDocuments = response.data.documents
  /*  const mockDocuments = [
    { id: 1, name: 'passport.pdf', type: 'pdf', date_signed: '2024-06-01T10:00:00Z' },
    { id: 2, name: 'driver_license.jpg', type: 'image', date_signed: '2024-05-20T14:30:00Z' },
    { id: 3, name: 'utility_bill.png', type: 'image', date_signed: '2024-04-15T09:15:00Z' },
  ] */
  return userDocuments
}

export const deleteUser = async (id) => {
  return await apiConfig.delete(`/admin/users/delete/${id}`)
}
