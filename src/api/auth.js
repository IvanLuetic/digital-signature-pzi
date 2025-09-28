import apiConfig from './config'

const signUp = async (data) => {
  const response = await apiConfig.post('/auth/signup', data)
  const { user, token } = response.data
  return { user, token }
}

const login = async (data) => {
  const response = await apiConfig.post('/auth/login', data)
  const { user, token } = response.data
  return { user, token }
}

const fetchUser = async () => {
  const response = await apiConfig.get('/auth/me')
  const {
    data: { user },
  } = response
  return user
}

const logout = async () => {
  await apiConfig.post('/auth/logout')
}

// ?

const requestPasswordReset = async (email) => {
  return await apiConfig.post('/auth/forgot-password', email)
}

const resetPassword = async (password, token) => {
  return await apiConfig.post('/auth/reset-password', password, {
    params: { token },
  })
}

const changePassword = async (oldPassword, newPassword) => {
  return await apiConfig.patch('/auth/change-password', { oldPassword, newPassword })
}

const checkAdmin = async () => {
  return await apiConfig.checkAdmin('/auth/check-admin')
}

export const authApi = {
  signUp,
  login,
  fetchUser,
  logout,
  requestPasswordReset,
  resetPassword,
  changePassword,
  checkAdmin,
}
