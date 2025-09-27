<template>
  <app-user-view
    v-if="viewUserDocuments"
    :username="userUsername"
    :documents="userDocuments"
    @close="viewUserDocuments = false"
  >
  </app-user-view>
  <div class="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen relative">
    <app-error v-if="error || success" :error="error" :success="success" @close="clearError()">
    </app-error>
    <div class="mb-8">
      <span class="text-4xl font-bold text-gray-800">Admin Dashboard</span>
      <p class="text-gray-600 mt-2">Manage users and view document signing activities</p>
    </div>
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-scroll">
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <span class="text-2xl sm:text-3xl font-semibold text-gray-800">User management</span>
          <span class="text-sm ml-3 text-gray-500">{{ totalUsers }} users</span>
        </div>
      </div>

      <div class="p-6">
        <div v-if="loading" class="text-center py-8">
          <div
            class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
          ></div>
          <p class="mt-2 text-gray-600">Loading users...</p>
        </div>

        <div v-else-if="users.length === 0" class="text-center py-8">
          <svg
            class="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            ></path>
          </svg>
          <p class="mt-2 text-gray-600">No users found</p>
        </div>

        <table v-else class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                User
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Email
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                ID
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Join Date
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200 overflow-x-scroll">
            <tr v-for="user in users" :key="user.id" class="hover:bg-blue-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div
                    class="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold"
                  >
                    {{ user.username.charAt(0).toUpperCase() }}
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-semibold text-gray-800">{{ user.username }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-800">{{ user.email }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-800">{{ user.id }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-600">
                  {{
                    new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })
                  }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center space-x-3">
                  <button
                    @click="handleGetUserDocuments(user.username, user.id)"
                    class="text-blue-600 cursor-pointer hover:text-blue-800 font-medium text-sm"
                  >
                    View
                  </button>
                  <button
                    @click="handleDeleteUser(user.id)"
                    class="text-red-600 cursor-pointer hover:text-red-800 font-medium text-sm"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-600">
            Showing {{ (currentPage - 1) * 12 + 1 }} to
            {{ Math.min(currentPage * 12, totalUsers) }} of {{ totalUsers }} results
          </div>
          <div class="flex items-center space-x-2">
            <button
              class="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
              :disabled="currentPage === 1"
              :class="[currentPage === 1 ? 'cursor-not-allowed' : 'cursor-pointer']"
              @click="previousPage"
            >
              Previous
            </button>
            <button class="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
              {{ currentPage }}
            </button>
            <button
              class="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
              :disabled="currentPage === totalPages"
              :class="[currentPage === totalPages ? 'cursor-not-allowed' : 'cursor-pointer']"
              @click="nextPage"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { deleteUser, getUsers } from '@/api/user'
import { onMounted, ref, computed } from 'vue'
import { getUserDocuments } from '@/api/user'
import AppError from './AppError.vue'
import AppUserView from './AppUserView.vue'

const error = ref('')
const success = ref('')
const viewUserDocuments = ref(false)

const users = ref([])
const loading = ref(false)
const currentPage = ref(1)
const totalUsers = ref(0)
const totalPages = computed(() => Math.ceil(totalUsers.value / 12))

const userDocuments = ref([])
const userUsername = ref('')

const handleGetUserDocuments = async (username, id) => {
  userUsername.value = username
  viewUserDocuments.value = true
  try {
    const response = await getUserDocuments(id)
    userDocuments.value = response
  } catch (error) {
    console.error('Failed to get user documents:', error)
  }
}

const handleDeleteUser = async (id) => {
  if (confirm('Are you sure you want to delete this user?')) {
    try {
      await deleteUser(id)
      await newPage(currentPage.value)
      success.value = 'User deleted succesfully'
    } catch (error) {
      error.value = 'Failed to delete user'
      console.error(error)
    }
  } else {
    return
  }
}

const previousPage = async () => {
  currentPage.value--
  await newPage(currentPage.value)
}

const nextPage = async () => {
  currentPage.value++
  await newPage(currentPage.value)
}

const newPage = async (page, sort) => {
  loading.value = true
  try {
    const response = await getUsers(page, sort)
    users.value = response.data.data.user.users
    totalUsers.value = response.data.data.user.totalUsers
  } catch (err) {
    console.error('Failed to fetch users:', err)
  } finally {
    loading.value = false
  }
}
const clearError = () => {
  error.value = ''
  success.value = ''
}

onMounted(async () => {
  await newPage(1)
})
</script>
