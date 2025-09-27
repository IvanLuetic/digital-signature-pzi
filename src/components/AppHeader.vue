<template>
  <nav class="bg-blue-600 text-white sticky top-0 z-10 shadow-md">
    <div class="mx-auto px-5 sm:px-25">
      <div class="flex items-center justify-between h-16">
        <router-link
          to="/"
          class="font-medium hover:text-blue-100 transition-colors"
          @click="scrollToTop"
        >
          <h3>DocSigner</h3>
        </router-link>

        <!-- Desktop -->
        <div class="hidden sm:flex items-center space-x-4">
          <template v-if="!userStore.currentUser">
            <a href="#about" class="hover:text-blue-100 px-3 py-2 transition-colors">About</a>
            <router-link to="/auth" class="hover:text-blue-100 px-3 py-2 transition-colors">
              Log in
            </router-link>
            <router-link to="/auth" class="hover:text-blue-100 px-3 py-2 transition-colors">
              Register
            </router-link>
          </template>

          <template v-if="userStore.currentUser.role === 'User'">
            <router-link to="/sign" class="hover:text-blue-100 px-3 py-2 transition-colors">
              Sign document
            </router-link>

            <router-link
              to="/profile"
              class="hover:text-blue-100 px-3 py-2 transition-colors flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clip-rule="evenodd"
                />
              </svg>
              Profile
            </router-link>

            <button
              @click="userStore.handleLogout"
              class="hover:text-blue-100 px-3 py-2 transition-colors cursor-pointer"
            >
              Log out
            </button>
          </template>
          <template v-if="userStore.currentUser.role === 'Admin'"
            >"
            <router-link to="/admin" class="hover:text-blue-100 px-3 py-2 transition-colors">
              Admin panel
            </router-link>

            <router-link
              to="/profile"
              class="hover:text-blue-100 px-3 py-2 transition-colors flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clip-rule="evenodd"
                />
              </svg>
              Profile
            </router-link>

            <button
              @click="userStore.handleLogout"
              class="hover:text-blue-100 px-3 py-2 transition-colors cursor-pointer"
            >
              Log out
            </button>
          </template>
        </div>

        <!-- Mobile menu button -->
        <div class="sm:hidden">
          <button
            @click="isOpen = !isOpen"
            class="inline-flex items-center justify-center p-2 rounded-md hover:text-blue-100 focus:outline-none transition-colors"
          >
            <svg
              class="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile -->
    <div v-show="isOpen" class="sm:hidden bg-blue-700">
      <div class="px-2 pt-2 pb-3 space-y-1">
        <template v-if="!userStore.currentUser">
          <a href="#about" class="block px-3 py-2" @click="isOpen = false"> About </a>
          <router-link to="/auth" class="block px-3 py-2" @click="isOpen = false">
            Log in
          </router-link>
          <router-link to="/auth" class="block px-3 py-2" @click="isOpen = false">
            Register
          </router-link>
        </template>

        <template v-if="userStore.currentUser.role === 'User'">
          <router-link
            to="/sign"
            class="px-2 py-2 flex flex-row hover:bg-blue-600 rounded-md transition-colors items-center"
            @click="isOpen = false"
          >
            Sign document
          </router-link>
          <router-link
            to="/profile"
            class="px-2 py-2 flex flex-row hover:bg-blue-600 rounded-md transition-colors items-center"
            @click="isOpen = false"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clip-rule="evenodd"
              />
            </svg>
            Profile
          </router-link>
          <button
            @click="(userStore.handleLogout, (isOpen = false))"
            class="w-full text-left px-3 py-2 hover:bg-blue-600 rounded-md transition-colors"
          >
            Log out
          </button>
        </template>
        <template v-if="userStore.currentUser.role === 'Admin'">
          <router-link
            to="/admin"
            class="px-2 py-2 flex flex-row hover:bg-blue-600 rounded-md transition-colors items-center"
            @click="isOpen = false"
          >
            Admin dashboard
          </router-link>
          <router-link
            to="/profile"
            class="px-2 py-2 flex flex-row hover:bg-blue-600 rounded-md transition-colors items-center"
            @click="isOpen = false"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clip-rule="evenodd"
              />
            </svg>
            Profile
          </router-link>
          <button
            @click="(userStore.handleLogout, (isOpen = false))"
            class="w-full text-left px-3 py-2 hover:bg-blue-600 rounded-md transition-colors"
          >
            Log out
          </button>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '../stores/user.js'

const userStore = useUserStore()
const isOpen = ref(false)

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}
</script>
