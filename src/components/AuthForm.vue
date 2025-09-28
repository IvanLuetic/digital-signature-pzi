<template>
  <div
    class="w-full max-w-100 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-400"
  >
    <div class="bg-blue-600 pt-1">
      <router-link to="/"><h3 class="text-white font-bold text-center">DocSigner</h3></router-link>
      <p class="text-blue-100 text-center mt-1 pb-3">
        {{ isLogin ? 'Log into your account' : 'Create your account' }}
      </p>
    </div>

    <form @submit.prevent="submit" class="p-6 space-y-5">
      <div>
        <label for="username" class="block text-sm font-medium text-gray-700 mb-2">Username</label>
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
        <label for="password" class="block text-sm font-medium text-gray-700 mb-2">Password</label>
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

      <div class="flex flex-col text-center text-sm gap-4 text-gray-600">
        <div>
          <span>{{ isLogin ? "Don't have an account?" : 'Already have an account?' }}</span>
          <button
            type="button"
            @click="$emit('changePage')"
            class="ml-1 text-blue-600 hover:text-blue-800 font-medium focus:outline-none cursor-pointer"
          >
            {{ isLogin ? 'Sign up' : 'Login' }}
          </button>
        </div>

        <router-link
          to="/forgot-password"
          class="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 focus:outline-none focus:underline"
        >
          <div v-if="isLogin" class="text-center">Forgot password?</div>
        </router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['submit', 'changePage'])

const submit = () => {
  emit('submit', { username: username.value, email: email.value, password: password.value })
}
const { isLogin, errorMessages } = defineProps({
  isLogin: {
    required: true,
    default: true,
    type: Boolean,
  },
  errorMessages: {
    type: Object,
  },
})
const username = ref('')
const email = ref('')
const password = ref('')
</script>
