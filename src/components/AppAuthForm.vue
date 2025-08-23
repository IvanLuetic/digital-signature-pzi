<template>
  <div class="min-h-screen flex items-center justify-center bg-gray mx-2">
    <div
      v-if="errorMessages.otherError"
      class="absolute max-w-md bg-red-500 rounded-lg px-4 py-3 shadow-lg top-0 mt-5 text-white font-medium flex items-center animate-fade-in"
    >
      <svg
        class="w-5 h-5 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
      </svg>
      {{ errorMessages.otherError }}
      <button @click="errorMessages.otherError = ''" class="ml-3">
        <svg
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      </button>
    </div>
    <div
      class="w-full max-w-100 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-400"
    >
      <div class="bg-blue-600 pt-1">
        <router-link to="/"
          ><h3 class="text-white font-bold text-center">DocSigner</h3></router-link
        >
        <p class="text-blue-100 text-center mt-1 pb-3">
          {{ isLogin ? 'Log into your account' : 'Create your account' }}
        </p>
      </div>

      <form @submit.prevent="submit" class="p-6 space-y-5">
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700 mb-2"
            >Username</label
          >
          <input
            id="username"
            v-model="username"
            placeholder="Enter your username"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
          <div v-if="errorMessages.usernameError" class="text-red-500 text-xs absolute ml-2">
            {{ errorMessages.usernameError }}
          </div>
        </div>

        <div v-if="!isLogin">
          <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="Enter your email"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
          <div v-if="errorMessages.emailError" class="text-red-500 text-xs absolute ml-2">
            {{ errorMessages.emailError }}
          </div>
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-2"
            >Password</label
          >
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Enter your password"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
          <div v-if="errorMessages.passwordError" class="text-red-500 text-xs absolute ml-2">
            {{ errorMessages.passwordError }}
          </div>
        </div>

        <button
          type="submit"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 mt-3 mb-3 cursor-pointer rounded-md transition duration-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {{ isLogin ? 'Sign In' : 'Create Account' }}
        </button>

        <div class="text-center text-sm text-gray-600">
          <span>{{ isLogin ? "Don't have an account?" : 'Already have an account?' }}</span>
          <button
            type="button"
            @click="isLogin = !isLogin"
            class="ml-1 text-blue-600 hover:text-blue-800 font-medium focus:outline-none cursor-pointer"
          >
            {{ isLogin ? 'Sign up' : 'Login' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { authApi } from '@/api/auth'

const router = useRouter()
const userStore = useUserStore()
const isLogin = ref(false)
const username = ref('')
const email = ref('')
const password = ref('')
const errorMessages = ref({
  usernameError: '',
  emailError: '',
  passwordError: '',
  otherError: '',
})

const submit = async () => {
  Object.keys(errorMessages.value).forEach((error) => {
    errorMessages.value[error] = ''
  })

  //validation
  let hasError = false
  if (!username.value) {
    errorMessages.value.usernameError = 'Username is required!'
    hasError = true
  }
  if (!isLogin.value && !email.value) {
    errorMessages.value.emailError = 'Email is required!'
    hasError = true
  }
  if (password.value.length < 8) {
    errorMessages.value.passwordError = 'Password must be at least 8 characters long!'
    hasError = true
  }
  if (hasError) return

  try {
    const user = await authApi[isLogin.value ? 'login' : 'signUp']({
      username: username.value,
      password: password.value,
      ...(!isLogin.value ? { email: email.value } : {}),
    })
    userStore.currentUser = user
    router.push({
      name: 'home',
    })
  } catch (err) {
    console.error('Error details:', err.response?.data.message)
    const message = err.response?.data?.message || 'An unexpected error occurred'

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
watch(isLogin, () => {
  Object.keys(errorMessages.value).forEach((error) => {
    errorMessages.value[error] = ''
  })
})
</script>
