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
  const response = await apiConfig.get(`/admin/user/${id}/documents/`)
  const userDocuments = response.data.documents
  return userDocuments
}

export const deleteUser = async (id) => {
  return await apiConfig.delete(`/admin/user/${id}`)
}
