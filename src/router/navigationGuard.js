import { useUserStore } from '@/stores/user'
import { authApi } from '@/api/auth'

export const forbidUnauthenticated = async () => {
  const userStore = useUserStore()
  if (userStore.currentUser) return true

  try {
    const user = await authApi.fetchUser()
    userStore.currentUser = user
    return true
  } catch {
    return false
  }
}
