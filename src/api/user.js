import apiConfig from './config'

export const editProfile = async (data) => {
  await apiConfig.patch('/users/profile', data)
}
