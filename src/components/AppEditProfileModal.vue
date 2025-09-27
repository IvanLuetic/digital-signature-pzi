<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 px-2">
    <app-error v-if="error || success" :error="error" :success="success" @close="clearError()">
    </app-error>
    <div class="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
      <div class="flex items-center justify-between pb-3 border-b">
        <h3 class="text-lg mt-2 font-semibold text-gray-900">Edit Profile</h3>
        <button
          @click="$emit('closeModal')"
          class="text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>

      <div>
        <div v-if="!editingPassword" class="py-4 space-y-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Username</label>
          <input
            v-model="editUsername"
            type="text"
            :placeholder="user.username"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />

          <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            v-model="editEmail"
            type="email"
            :placeholder="user.email"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />

          <label
            @click="editingPassword = true"
            class="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer font-medium transition-colors duration-200 focus:outline-none focus:underline"
            >Change Password</label
          >
        </div>
        <div v-else class="py-4 space-y-6">
          <div class="relative">
            <input
              v-model="oldPassword"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Enter your current password"
              class="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute cursor-pointer right-0 inset-y-0 mr-6"
            >
              <svg
                v-if="showPassword"
                class="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                ></path>
              </svg>
              <svg
                v-else
                class="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                ></path>
              </svg>
            </button>
          </div>
          <div class="relative">
            <input
              v-model="newPassword"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Enter your new password"
              class="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute cursor-pointer right-0 inset-y-0 mr-6"
            >
              <svg
                v-if="showPassword"
                class="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                ></path>
              </svg>
              <svg
                v-else
                class="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div class="flex items-center justify-end pt-3 border-t space-x-3">
        <button
          @click="$emit('closeModal')"
          class="px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-400 cursor-pointer"
        >
          Cancel
        </button>
        <button
          @click="saveProfile"
          :disabled="saving"
          class="px-4 py-2 bg-blue-600 cursor-pointer text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="saving">Saving...</span>
          <span v-else>Save Changes</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue'
import { editProfile } from '@/api/user'
import { useUserStore } from '@/stores/user'
import AppError from './AppError.vue'
import { authApi } from '@/api/auth'
import router from '@/router'

const emit = defineEmits(['closeModal'])
const userStore = useUserStore()

const user = userStore.currentUser

const editEmail = ref('')
const editUsername = ref('')
const editingPassword = ref('')
const newPassword = ref('')
const oldPassword = ref('')
const showPassword = ref(false)
const saving = ref(false)

const success = ref('')
const error = ref('')

const saveProfile = async () => {
  success.value = ''
  error.value = ''
  saving.value = true

  if (!editingPassword.value) {
    if (!editUsername.value && !editEmail.value) {
      error.value = 'Please enter a new username or email.'
      saving.value = false
      return
    }
    if (editUsername.value && editUsername.value.trim().length < 3) {
      error.value = 'Username must be at least 3 characters long'
      saving.value = false
      return
    }

    if (editEmail.value && !editEmail.value.includes('@')) {
      error.value = 'Please enter a valid email address!'
      saving.value = false
      return
    }
    try {
      const updateData = {}
      if (editUsername.value) {
        updateData.username = editUsername.value.trim()
      } else {
        updateData.username = user.username
      }
      if (editEmail.value) {
        updateData.email = editEmail.value.trim()
      } else {
        updateData.email = user.email
      }

      await editProfile(updateData)
      success.value = 'Profile updated successfully!'
      emit('closeModal')
    } catch (err) {
      error.value = err.response?.message || 'Something went wrong'
    } finally {
      editUsername.value = ''
      editEmail.value = ''
      saving.value = false
    }
  } else {
    if (newPassword.value && newPassword.value.length < 8) {
      error.value = 'Password must be at least 8 characters long!'
      saving.value = false
      return
    }
    try {
      await authApi.changePassword(oldPassword.value, newPassword.value)
      success.value = 'Password changed succesfully! Please login again with your new password'
      setTimeout(() => {
        router.push('/auth')
      }, 3000)
    } catch (err) {
      error.value = err.response?.message || 'Something went wrong'
    } finally {
      oldPassword.value = ''
      newPassword.value = ''
      saving.value = false
    }
  }
}
const clearError = () => (error.value = '')
</script>
