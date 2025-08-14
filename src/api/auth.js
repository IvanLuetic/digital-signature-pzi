import apiConfig from './config'

const signUp = async (data) => {
  /* return await apiConfig.post('/auth/signup', data) */
  const user = {
    username: data.username,
    email: data.email,
    password: data.password,
  }
  return user
}
const login = async (data) => {
  return await apiConfig.post('/auth/login', data)
}

//get user with cookies
const fetchUser = async () => {
  const response = await apiConfig.get('/auth/getMe')
  const {
    data: { user },
  } = response.data
  return user
}

export const authApi = { signUp, login, fetchUser }
