<template>
  <div class="min-h-screen flex items-center justify-center mx-4">
    <app-error
      v-if="error || success"
      :success="success"
      :error="error"
      @close="clearError()"
    ></app-error>

    <!-- <div
      v-if="success"
      class="w-full max-w-110 bg-white rounded-xl shadow-lg border border-gray-400 p-6"
    >
      <div class="bg-blue-600 pt-1 -m-6 mb-6 rounded-t-xl">
        <router-link to="/">
          <h3 class="text-white font-bold text-center">DocSigner</h3>
        </router-link>
        <p class="text-blue-100 text-center mt-1 pb-3">Reset your password on the link below.</p>
      </div>

      <h3 class="font-semibold text-blue-800 mb-4 w-full text-center"> Reset Link Generated</h3>

      <div class="flex w-full items-center gap-2 mb-6">
        <input
          :value="resetLink"
          readonly
          class="flex w-full px-3 py-2 border border-gray-300 rounded text-sm"
          ref="linkInput"
        />
      </div>

      <div class="flex justify-center">
        <a
          :href="resetLink"
          target="_blank"
          class="inline-block bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-700 hover:to-blue-800 text-lg font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer"
        >
          Open Reset Page
        </a>
      </div>
    </div> -->

    <ForgotPasswordForm v-if="!success" @requestReset="requestReset($event)"></ForgotPasswordForm>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { authApi } from '@/api/auth'
import AppError from '../components/AppError.vue'
import ForgotPasswordForm from '@/components/ForgotPasswordForm.vue'

const error = ref('')
const success = ref('')
const resetLink = ref('')
/* const linkInput = ref(null) */

const requestReset = async (email) => {
  if (!email) {
    error.value = 'Email is required!'
    return
  }
  error.value = ''
  success.value = ''
  resetLink.value = ''
  try {
    await authApi.requestPasswordReset({
      email: email,
    })
    success.value = 'Reset link generated successfully!'
  } catch (err) {
    error.value = err.response?.data?.message || 'Something went wrong.'
  }
}

const clearError = () => {
  error.value = ''
  success.value = ''
}
</script>
