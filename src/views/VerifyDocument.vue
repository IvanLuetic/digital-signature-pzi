<template>
  <AppHeader></AppHeader>
  <AppError
    v-if="error || success"
    :error="error"
    :success="success"
    @close="clearError()"
    class="mx-auto"
  ></AppError>
  <div class="py-6 px-0 text-center">
    <h1 class="font-bold mb-2 mx-auto">Verify Signed Document</h1>
    <h4 class="text-gray-800 max-w-160 mx-auto">
      Upload a ZIP file containing the signed document and signature file
    </h4>
  </div>

  <div class="flex flex-col items-center gap-8 mx-4 pb-30">
    <div class="w-full md:w-3/5 lg:w-2/5 flex justify-center items-center">
      <div
        ref="uploadArea"
        class="flex flex-col justify-around items-center min-h-[40vh] w-full relative bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl border-2 border-dashed border-gray-300 hover:border-blue-200 hover:bg-gradient-to-br hover:from-blue-50 hover:to-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl"
        :class="{ 'animate-pulse scale-[1.02] border-blue-500': isUploading }"
        @dragover.prevent
        @dragenter.prevent
        @drop.prevent="handleFile"
      >
        <div
          v-if="isChecking"
          class="flex justify-center items-center z-50 absolute inset-0 bg-white/80 backdrop-blur-sm rounded-2xl"
        >
          <div class="text-center space-y-4 p-8">
            <div
              class="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"
            ></div>
            <p class="font-semibold text-gray-700 text-lg">Verifying signature...</p>
          </div>
        </div>

        <i v-if="!file" class="mdi mdi-folder-zip text-7xl text-blue-600"></i>

        <div v-if="!file" class="text-xl text-gray-600 text-center font-medium">
          <span class="text-blue-600">Drag & Drop ZIP file</span>
          <br />
          <span class="text-gray-400 text-lg">OR</span>
          <br />
        </div>

        <input type="file" ref="fileInput" class="hidden" accept=".zip" @change="handleFile" />

        <div class="z-50">
          <button
            class="bg-white hover:bg-gray-10 text-gray-700 py-3 px-8 rounded-xl text-lg font-semibold border-2 border-gray-300 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
            v-if="!file"
            @click="triggerFileInput"
          >
            SELECT FILE
          </button>
          <button
            class="bg-white hover:bg-gray-100 text-gray-700 py-3 px-8 rounded-xl text-lg font-semibold border-2 border-gray-400 hover:border-gray-300 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
            v-else
            @click="removeFileInput"
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>

    <div class="relative bottom-6 text-center">
      <p v-if="file">{{ file.name }} selected</p>
    </div>

    <div class="flex items-center justify-center">
      <button
        @click="handleVerifyDocument"
        :disabled="!file || isChecking"
        class="bg-gradient-to-r absolute from-blue-500 to-blue-600 text-white hover:from-blue-700 hover:to-blue-800 w-50 text-2xl font-semibold py-6 rounded-full border-1 border-black shadow-xl hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ isChecking ? 'Verifying...' : 'Verify Signature' }}
      </button>
    </div>

    <div v-if="verificationResult" class="w-full md:w-3/5 lg:w-2/5 mt-8">
      <div class="p-6 rounded-xl border-2' 'border-green-500 bg-green-100">
        <div class="flex items-center gap-3 mb-4">
          <i class="mdi mdi-check-circle text-green-600 text-3xl"></i>
          <h3 class="text-xl font-semibold">Verification succesful!</h3>
        </div>

        <div class="text-left space-y-2">
          <p><strong>Signer:</strong> {{ verificationResult.signer_username }}</p>
          <p><strong>Signed at:</strong> {{ formatDate(verificationResult.signed_at) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { verifyDocument } from '@/api/document'
import { ref } from 'vue'
import AppError from '@/components/AppError.vue'
import AppHeader from '@/components/AppHeader.vue'

const error = ref('')
const success = ref('')
const isUploading = ref(false)
const file = ref(null)
const isChecking = ref(false)
const zipContents = ref(null)
const verificationResult = ref(null)

const fileInput = ref(null)
const uploadArea = ref(null)

const handleFile = async (event) => {
  isUploading.value = true
  const selectedFile = event.dataTransfer?.files[0] || event.target.files[0]
  file.value = selectedFile
  if (file.value.name.toLowerCase().endsWith('zip')) {
    isUploading.value = false
  } else {
    file.value = ''
    alert('Please upload a .zip file')
  }
}

const triggerFileInput = () => {
  fileInput.value.click()
}

const handleVerifyDocument = async () => {
  if (!file.value) {
    error.value = 'Please select a ZIP file to verify'
    return
  }
  isChecking.value = true
  verificationResult.value = null
  error.value = ''
  success.value = ''

  try {
    const formData = new FormData()
    formData.append('file', file.value)
    const response = await verifyDocument(formData)
    verificationResult.value = response.data
    success.value = response.data.message
  } catch (err) {
    if (err.response?.status === 404) {
      error.value = err.response.data.message || 'No matching signature found'
    } else {
      error.value = err.response?.data?.message || 'Error verifying document signature'
    }
  } finally {
    isChecking.value = false
  }
}

const removeFileInput = () => {
  file.value = null
  zipContents.value = null
  verificationResult.value = null
  isChecking.value = false
  fileInput.value.value = null
  error.value = ''
  success.value = ''
}

const clearError = () => {
  error.value = ''
  success.value = ''
}
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}
</script>
