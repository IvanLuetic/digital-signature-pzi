<template>
  <div class="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen relative">
    <!-- Main Content -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">My account</h1>
      <p class="text-gray-600">Manage your profile and view your signed documents</p>
    </div>

    <!-- Profile Card -->
    <div
      class="flex flex-col md:flex-row gap-4 bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8"
    >
      <div class="flex flex-col md:flex-row flex-grow items-center md:items-start gap-6">
        <!-- Avatar -->
        <div
          class="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-800 rounded-full flex flex-none items-center justify-center"
        >
          <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            ></path>
          </svg>
        </div>
        <!-- Profile Details -->
        <div class="flex flex-col gap-2 text-center md:text-start">
          <div>
            <h2 class="text-2xl font-semibold text-gray-900">
              {{ user.username }}
            </h2>
          </div>
          <div class="flex flex-row gap-1 -ml-1">
            <svg
              class="w-4 h-4 mt-1.5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              ></path>
            </svg>
            <span class="text-gray-600">Email:</span>
            <span class="font-medium">{{ user.email }}</span>
          </div>
        </div>
        <div class="flex flex-col flex-grow self-center md:ml-10 md:self-end">
          <div>
            <span class="text-gray-600">Member since: </span>
            <span class="font-medium">{{ formatDate(user.joinDate) }}</span>
          </div>
          <div class="flex flex-row gap-1 mx-auto md:mx-0">
            <span class="text-gray-600">Documents signed:</span>
            <span class="font-medium">{{
              user.totalDocumentsSigned ? user.totalDocumentsSigned : '0'
            }}</span>
          </div>
        </div>
      </div>
      <div class="flex mx-auto self-end">
        <button
          @click="showEditModal = true"
          class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md cursor-pointer hover:bg-blue-700"
        >
          Edit Profile
        </button>
      </div>
    </div>

    <app-edit-profile-modal
      v-if="showEditModal"
      @close-modal="showEditModal = false"
    ></app-edit-profile-modal>

    <app-document-modal
      v-if="showDocumentModal"
      @close-modal="showDocumentModal = false"
      :document="documentToView"
    ></app-document-modal>
    <!-- Documents -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">Signed Documents</h3>
          <span class="text-sm text-gray-500">{{ filteredDocuments.length }} documents</span>
        </div>

        <div class="mt-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <div class="relative flex-grow">
            <svg
              class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
            <input
              v-model="filter"
              type="text"
              placeholder="Search documents..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>

      <div class="p-6">
        <div v-if="loading" class="text-center py-8">
          <div
            class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
          ></div>
          <p class="mt-2 text-gray-600">Loading documents...</p>
        </div>

        <div v-else-if="filteredDocuments.length === 0" class="text-center py-8">
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
          <p class="mt-2 text-gray-600">No documents found</p>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="document in filteredDocuments"
            :key="document.id"
            class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
          >
            <div class="flex items-start justify-between">
              <div class="flex-grow min-w-0">
                <div class="flex items-center space-x-3 mb-2">
                  <svg
                    class="w-5 h-5 text-blue-600"
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
                  <h5 class="font-semibold truncate text-gray-900">
                    {{ document.file.originalname }}
                  </h5>
                </div>

                <div class="flex items-center space-x-6 text-sm text-gray-600">
                  <div class="flex items-center space-x-1">
                    <svg
                      class="w-4 h-4 mt-1.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-4 8a3 3 0 01-3-3V8a3 3 0 016 0v4a3 3 0 01-3 3z"
                      ></path>
                    </svg>
                    <span>Signed {{ formatDate(document.file.signedDate) }}</span>
                  </div>
                </div>
              </div>

              <div class="flex items-center space-x-2 ml-4">
                <button
                  @click="handleView(document)"
                  class="p-2 cursor-pointer text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                  title="View Document"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useDocumentStore } from '@/stores/document'
import { getDocuments } from '@/api/document'
import { useUserStore } from '@/stores/user'
import AppEditProfileModal from './AppEditProfileModal.vue'
import AppDocumentModal from './AppDocumentModal.vue'

const userStore = useUserStore()
const documentStore = useDocumentStore()

const documents = documentStore.documents
console.log('DOCUMENTS', documents)

const showEditModal = ref(false)
const showDocumentModal = ref(false)
const documentToView = ref({})

const user = userStore.currentUser
const { filteredDocuments, filter } = storeToRefs(documentStore)

const loading = ref(true)

const fetchUserData = async () => {
  loading.value = true
  await getDocuments()
  loading.value = false
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const handleView = (document) => {
  documentToView.value = document
  showDocumentModal.value = true
}

onMounted(async () => {
  await fetchUserData()
})
</script>
