<template>
  <div class="min-h-screen flex items-center justify-center mx-4">
    <app-error v-if="error || success" :error="error" :success="success" @close="clearError()">
    </app-error>
    <AppResetPasswordForm @resetPassword="resetPassword($event)"></AppResetPasswordForm>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authApi } from '@/api/auth'
import AppError from '../components/AppError.vue'
import AppResetPasswordForm from '@/components/AppResetPasswordForm.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const router = useRouter()
const error = ref('')
const success = ref('')

const resetPassword = async (data) => {
  if (data.newPassword.length < 8) {
    error.value = 'Password must be at least 8 characters long!'
    return
  }
  if (data.newPassword !== data.confirmPassword) {
    error.value = 'Passwords do not match'
    return
  }
  try {
    await authApi.resetPassword(
      {
        password: data.newPassword,
      },
      route.query.token,
    )
    success.value = 'Password reset successfully! Redirecting...'
    setTimeout(() => {
      router.push('/auth')
    }, 3000)
  } catch (err) {
    error.value = err.response?.data?.message || 'Something went wrong.'
  }
}
const clearError = () => (error.value = '')
</script>
