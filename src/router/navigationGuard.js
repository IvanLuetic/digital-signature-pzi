import { useUserStore } from '@/stores/user'
import { authApi } from '@/api/auth'

export const forbidUnauthenticated = async () => {
  const userStore = useUserStore()
  if (userStore.currentUser) return true

  try {
    const user = await authApi.fetchUser()
    userStore.user = user
    return true
  } catch {
    return { name: 'AuthPage' }
  }
}
