import apiConfig from './config'

const signUp = async (data) => {
  const response = await apiConfig.post('/auth/signup', data)
  const {
    data: { user },
  } = response.data
  return user
}
const login = async (data) => {
  const response = await apiConfig.post('/auth/login', data)
  const {
    data: { user },
  } = response.data
  return user
}

//get user with cookies
const fetchUser = async () => {
  const response = await apiConfig.get('/auth/me')
  const {
    data: { user },
  } = response.data
  return user
}

const logout = async () => {
  await apiConfig.post('/auth/logout')
}
export const authApi = { signUp, login, fetchUser, logout }
