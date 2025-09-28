<template>
  <div class="min-h-screen flex items-center justify-center mx-4">
    <app-error
      v-if="errorMessages.otherError"
      :error="errorMessages.otherError"
      @close="clearError()"
    >
    </app-error>
    <AuthForm
      :isLogin="isLogin"
      :errorMessages="errorMessages"
      @changePage="isLogin = !isLogin"
      @submit="handleSubmit($event)"
    ></AuthForm>
  </div>
</template>

<script setup>
import AuthForm from '@/components/AuthForm.vue'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { authApi } from '@/api/auth'
import AppError from '../components/AppError.vue'

const router = useRouter()
const userStore = useUserStore()
const isLogin = ref(true)
const errorMessages = ref({
  usernameError: '',
  emailError: '',
  passwordError: '',
  otherError: '',
})

const handleSubmit = async (data) => {
  Object.keys(errorMessages.value).forEach((error) => {
    errorMessages.value[error] = ''
  })

  const { username, email, password } = data

  let hasError = false
  if (username.trim().length < 3) {
    errorMessages.value.usernameError = 'Username must be at least 3 characters!'
    hasError = true
  }
  if (!isLogin.value && !email) {
    errorMessages.value.emailError = 'Email is required!'
    hasError = true
  }
  if (password.trim().length < 8) {
    errorMessages.value.passwordError = 'Password must be at least 8 characters long!'
    hasError = true
  }
  if (hasError) return

  try {
    const { user, token } = await authApi[isLogin.value ? 'login' : 'signUp']({
      username: username.trim(),
      password: password.trim(),
      ...(!isLogin.value ? { email: email.trim() } : {}),
    })
    userStore.currentUser = user
    localStorage.setItem('token', token)
    router.push({
      name: 'home',
    })
  } catch (err) {
    console.error('Error details:', err.response?.data.message)
    const message = err.response?.data?.message || 'Something went wrong.'

    // display backend errors
    if (message.toLowerCase().includes('email')) {
      errorMessages.value.emailError = message
    } else if (message.toLowerCase().includes('password')) {
      errorMessages.value.passwordError = message
    } else if (message.toLowerCase().includes('username')) {
      errorMessages.value.usernameError = message
    } else {
      errorMessages.value.otherError = message
    }
  }
}
const clearError = () => (errorMessages.value.otherError = '')

watch(isLogin, () => {
  Object.keys(errorMessages.value).forEach((error) => {
    errorMessages.value[error] = ''
  })
})
</script>
