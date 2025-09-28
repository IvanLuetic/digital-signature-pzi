<template>
  <div
    class="w-full max-w-100 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-400"
  >
    <div class="bg-blue-600 pt-1">
      <router-link to="/"><h3 class="text-white font-bold text-center">DocSigner</h3></router-link>
      <p class="text-blue-100 text-center mt-1 pb-3">Reset your password</p>
    </div>

    <form @submit.prevent="resetPassword" class="p-6 space-y-5">
      <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Password</label>
      <input
        id="newPassword"
        v-model="newPassword"
        type="password"
        placeholder="Enter your new password"
        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
      />
      <input
        id="confirmPassword"
        v-model="confirmPassword"
        type="password"
        placeholder="Confirm password"
        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
      />

      <button
        type="submit"
        class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 mt-3 mb-3 cursor-pointer rounded-md transition duration-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        Reset password
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['resetPassword'])

const resetPassword = () => {
  emit('resetPassword', { newPassword: newPassword.value, confirmPassword: confirmPassword.value })
}
const newPassword = ref('')
const confirmPassword = ref('')
</script>
