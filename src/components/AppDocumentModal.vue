<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <div class="flex items-center space-x-3 min-w-0 flex-1">
          <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            ></path>
          </svg>
          <div class="min-w-0 flex-1">
            <h4 class="text-lg font-semibold text-gray-900 truncate">
              {{ document.file.originalname }}
            </h4>
            <p class="text-sm text-gray-500">{{ getFileSize() }} • {{ document.file.mimetype }}</p>
          </div>
        </div>

        <button
          @click="closeModal"
          class="text-gray-400 cursor-pointer hover:text-gray-600 transition-"
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

      <div class="flex-1 p-6 overflow-auto">
        <div class="flex justify-center items-center min-h-[400px] bg-gray-50 rounded-lg">
          <!-- Image Display -->
          <img
            v-if="image && !loading"
            :src="image"
            :alt="document.file.originalname"
            class="max-w-full max-h-full object-contain rounded-lg shadow-sm"
          />

          <!-- PDF Canvas -->
          <canvas
            v-show="!image && isPDF && !loading"
            ref="pdfCanvas"
            class="max-w-full max-h-full rounded-lg shadow-sm"
          ></canvas>

          <div v-if="!isSupported" class="text-center py-12">
            <svg
              class="mx-auto h-16 w-16 text-gray-400 mb-4"
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
            <h4 class="text-lg font-medium text-gray-900 mb-2">Preview not available</h4>
          </div>

          <!-- Loading  -->
          <div v-if="loading" class="text-center py-12">
            <div
              class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"
            ></div>
            <p class="text-gray-600">Loading document...</p>
          </div>
        </div>
      </div>

      <div class="flex flex-row justify-between gap-5 p-6 border-t border-gray-200 bg-gray-50">
        <button
          @click="confirmDelete"
          :disabled="deleting"
          class="px-4 py-2 bg-red-600 text-white cursor-pointer text-sm font-medium rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span v-if="deleting">Deleting...</span>
          <span v-else class="flex items-center space-x-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              ></path>
            </svg>
            <span>Delete</span>
          </span>
        </button>

        <button
          @click="downloadDocument"
          class="px-4 py-2 bg-blue-600 text-white text-sm font-medium cursor-pointer rounded-md hover:bg-blue-700 transition-colors"
        >
          <span class="flex items-center space-x-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              ></path>
            </svg>
            <span>Download</span>
          </span>
        </button>
      </div>
    </div>
  </div>

  <!-- Delete Confirmation Modal -->
  <div
    v-if="showDeleteConfirm"
    class="fixed inset-0 bg-black bg-opacity-50 z-60 flex items-center justify-center p-4"
    @click="cancelDelete"
  >
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6" @click.stop>
      <div class="flex items-center mb-4">
        <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
          <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
            ></path>
          </svg>
        </div>
        <div>
          <h3 class="text-lg font-semibold text-gray-900">Delete Document</h3>
          <p class="text-sm text-gray-500">This action cannot be undone</p>
        </div>
      </div>

      <p class="text-gray-700 mb-6">
        Are you sure you want to delete "<strong>{{ document.file.originalname }}</strong
        >"?
      </p>

      <div class="flex space-x-3">
        <button
          @click="cancelDelete"
          class="px-4 py-2 text-gray-700 border cursor-pointer border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          @click="handleDeleteDocument"
          :disabled="deleting"
          class="px-4 py-2 bg-red-600 text-white cursor-pointer rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors"
        >
          <span v-if="deleting">Deleting...</span>
          <span v-else>Delete</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import * as pdfjsLib from 'pdfjs-dist'
pdfjsLib.GlobalWorkerOptions.workerSrc = '../../node_modules/pdfjs-dist/build/pdf.worker.mjs'
import { deleteDocument } from '@/api/document'

// Passed-in document
const { document } = defineProps({
  document: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['closeModal'])

const image = ref(null)
const pdfCanvas = ref(null)
const loading = ref(true)
const deleting = ref(false)
const showDeleteConfirm = ref(false)

const isImage = computed(() => document.file.mimetype.startsWith('image/'))
const isPDF = computed(() => document.file.mimetype === 'application/pdf')
//If it's a .docx, nothing is displayed
const isSupported = computed(() => isImage.value || isPDF.value)

const getFileSize = () => {
  const bytes = document.file.size
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const displayDocument = async () => {
  loading.value = true
  const fileData = document.file
  try {
    if (fileData.mimetype.startsWith('image/')) {
      // Convert buffer data to blob to display image
      const uint8Array = new Uint8Array(fileData.buffer.data)
      const blob = new Blob([uint8Array], { type: fileData.mimetype })
      const fileUrl = URL.createObjectURL(blob)
      image.value = fileUrl
    } else if (fileData.mimetype === 'application/pdf') {
      // Convert buffer data for PDF rendering
      await renderPDF(fileData)
      image.value = null
    } else {
      console.log('Unsupported file type:', fileData.mimetype)
    }
  } catch (error) {
    console.error('Error displaying document:', error)
  } finally {
    loading.value = false
  }
}

const renderPDF = async (fileData) => {
  try {
    const uint8Array = new Uint8Array(fileData.buffer.data)
    const pdf = await pdfjsLib.getDocument(uint8Array).promise
    const page = await pdf.getPage(1)

    const viewport = page.getViewport({ scale: 1.5 })
    const canvas = pdfCanvas.value
    const context = canvas.getContext('2d')

    canvas.width = viewport.width
    canvas.height = viewport.height

    await page.render({
      canvasContext: context,
      viewport: viewport,
    }).promise
  } catch (error) {
    console.error('Error rendering PDF', error)
  }
}

const downloadDocument = () => {
  try {
    const byteArray = new Uint8Array(document.file.buffer.data)
    const blob = new Blob([byteArray], { type: document.file.mimetype })

    const url = window.URL.createObjectURL(blob)
    const a = window.document.createElement('a')
    a.href = url
    a.download = document.file.originalname
    window.document.body.appendChild(a)
    a.click()

    setTimeout(() => {
      window.document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    }, 100)
  } catch (error) {
    console.error('Download failed:', error)
  }
}

const confirmDelete = () => {
  showDeleteConfirm.value = true
}

const cancelDelete = () => {
  showDeleteConfirm.value = false
}

const handleDeleteDocument = async () => {
  deleting.value = true
  try {
    await deleteDocument(document.id)
    closeModal()
  } catch (error) {
    console.error('Delete failed', error)
  } finally {
    deleting.value = false
    showDeleteConfirm.value = false
  }
}

const closeModal = () => {
  if (image.value && image.value.startsWith('blob:')) {
    URL.revokeObjectURL(image.value)
  }
  emit('closeModal')
}

onMounted(() => {
  displayDocument()
})
</script>
