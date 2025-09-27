import { authApi } from '@/api/auth'

export const forbidUnauthorized = async () => {
  try {
    await authApi.checkAdmin()
    return true
  } catch {
    return false
  }
}
