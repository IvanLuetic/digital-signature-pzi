<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70">
    <div
      class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 min-w-[300px] max-w-lg w-full"
    >
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-semibold text-gray-800">{{ username }}'s documents</h3>
        <span class="text-sm text-gray-500">{{ documents.length }} documents</span>
      </div>

      <div class="space-y-4 max-h-96 overflow-y-auto">
        <div
          v-for="document in documents"
          :key="document.id"
          class="border-2 border-blue-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
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
                  {{ formatName(document.signed_file_url) }}
                </h5>
              </div>

              <div class="flex items-center space-x-6 text-sm text-gray-600">
                <div class="flex items-center space-x-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    ></path>
                  </svg>
                  <span>Signed {{ formatDate(document.signed_at) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!documents || documents.length === 0" class="text-center py-8">
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

      <div class="mt-6 flex justify-end">
        <button
          @click="$emit('close')"
          class="px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-400 cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const { documents, username } = defineProps({
  documents: {
    type: Array,
    default: () => [],
  },
  username: {
    type: String,
    required: true,
  },
})

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
const formatName = (path) => {
  return path.split('uploads\\').pop()
}
</script>
