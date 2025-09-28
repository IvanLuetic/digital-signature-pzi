import { ref } from 'vue'
import { defineStore } from 'pinia'
import { authApi } from '@/api/auth'
import router from '@/router'

export const useUserStore = defineStore('user', () => {
  const currentUser = ref(null)

  const handleLogout = async () => {
    try {
      await authApi.logout()
      currentUser.value = null
      localStorage.removeItem('token')
      router.push('/')
    } catch (err) {
      console.error(err)
    }
  }

  const initializeUser = async () => {
    try {
      const user = await authApi.fetchUser()
      currentUser.value = user
      console.log(currentUser.value)
    } catch {
      currentUser.value = null
    }
  }

  return { currentUser, handleLogout, initializeUser }
})
