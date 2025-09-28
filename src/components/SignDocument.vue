<template>
  <SignDocForm
    v-if="isSignDocumentFormOpen"
    @close="isSignDocumentFormOpen = false"
    @sign="handleSignDocument($event)"
    :keys="publicKeys"
  ></SignDocForm>

  <div class="py-6 px-0 text-center">
    <h1 class="font-bold mb-2 mx-auto">Upload document to sign</h1>
    <h4 class="text-gray-800 max-w-160 mx-auto">
      Click below to upload your document or drag and drop it here. Accepted file formats: PDF, JPG,
      PNG
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
          v-if="isSigning"
          class="flex justify-center items-center z-50 absolute inset-0 bg-white/80 backdrop-blur-sm rounded-2xl"
        >
          <div class="text-center space-y-4 p-8">
            <div
              class="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"
            ></div>
            <p class="font-semibold text-gray-700 text-lg">Signing your document...</p>
          </div>
        </div>

        <i v-if="!file" class="mdi mdi-cloud-upload text-7xl text-blue-600"></i>

        <div v-if="!file" class="text-xl text-gray-600 text-center font-medium">
          <span class="text-blue-600">Drag & Drop</span>
          <br />
          <span class="text-gray-400 text-lg">OR</span>
          <br />
        </div>

        <img
          v-if="image"
          :src="image"
          alt="Uploaded Document"
          :class="[
            isSigning
              ? 'blur-sm w-full absolute h-full object-cover rounded-2xl'
              : 'blur-xs w-full absolute h-full object-cover rounded-2xl',
          ]"
        />

        <canvas
          v-if="file && !image"
          ref="pdfCanvas"
          class="min-h-[40vh] w-full absolute h-full rounded-2xl"
          style="filter: blur(1px)"
        ></canvas>

        <input
          type="file"
          ref="fileInput"
          class="hidden"
          accept=".jpg, .png, .pdf"
          @change="handleFile"
        />

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

    <div v-if="!isSigned" class="flex items-center justify-center">
      <button
        @click="openSignDocumentForm"
        class="bg-gradient-to-r absolute from-blue-500 to-blue-600 text-white hover:from-blue-700 hover:to-blue-800 w-50 text-2xl font-semibold py-6 rounded-full border-1 border-black shadow-xl hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer"
      >
        Sign document
      </button>
    </div>
    <div v-else class="flex items-center justify-center">
      <button
        @click="saveDocument"
        class="bg-gradient-to-r absolute from-blue-500 to-blue-600 text-white hover:from-blue-700 hover:to-blue-800 text-2xl font-semibold py-6 px-7 rounded-full border-1 border-black shadow-xl hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer"
      >
        Download <i class="mdi mdi-download text-2xl mt-1"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { downloadDocument, getPublicKeys, signDocument } from '@/api/document'
import * as pdfjsLib from 'pdfjs-dist'
import { ref } from 'vue'
import SignDocForm from './SignDocForm.vue'
pdfjsLib.GlobalWorkerOptions.workerSrc = '../../node_modules/pdfjs-dist/build/pdf.worker.mjs'

const emit = defineEmits(['message'])
const isUploading = ref(false)
const file = ref(null)
const isSigned = ref(false)
const isSigning = ref(false)
const publicKeys = ref([])
const isSignDocumentFormOpen = ref(false)
const signedDocumentId = ref('')

const openSignDocumentForm = async () => {
  if (file.value) {
    const response = await getPublicKeys()
    publicKeys.value = response.data.keys
    isSignDocumentFormOpen.value = true
  } else alert('Please upload a file to sign')
}

const image = ref(null)
const fileInput = ref(null)
const uploadArea = ref(null)
const pdfCanvas = ref(null)

const handleFile = (event) => {
  file.value = event.target.files[0]
  console.log(file.value)
  isUploading.value = true
  if (
    file.value &&
    (file.value.type.endsWith('png') ||
      file.value.type.endsWith('jpeg') ||
      file.value.type === 'application/pdf')
  ) {
    if (file.value.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = () => {
        const fileUrl = reader.result
        image.value = fileUrl

        pdfCanvas.value.style.display = 'none'
      }
      reader.readAsDataURL(file.value)
    } else if (file.value.type === 'application/pdf') {
      renderPDF(file.value)
      image.value = null
    } else {
      uploadArea.value.style.backgroundImage = ''
    }
    isUploading.value = false
  } else {
    isUploading.value = false
    alert('Allowed file types are .png, .jpg and .pdf')
    file.value = null
  }
}

const renderPDF = async (pdfFile) => {
  const reader = new FileReader()
  reader.onload = async (e) => {
    try {
      const arrayBuffer = e.target.result
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise
      const page = await pdf.getPage(1)

      const viewport = page.getViewport({ scale: 1 })
      const canvas = pdfCanvas.value
      const context = canvas.getContext('2d')

      canvas.width = viewport.width
      canvas.height = viewport.height

      await page.render({
        canvasContext: context,
        viewport: viewport,
      }).promise
    } catch (error) {
      console.error('Error rendering PDF:', error)
    }
  }
  reader.readAsArrayBuffer(pdfFile)
}

const triggerFileInput = () => {
  fileInput.value.click()
}

const handleSignDocument = async (data) => {
  if (file.value) {
    isSigning.value = true
    try {
      const formData = new FormData()
      formData.append('file', file.value)
      formData.append('public_key_id', data.public_key_id)
      formData.append('password', data.password)
      const response = await signDocument(formData)
      signedDocumentId.value = response.data.id
      emit('message', {
        type: 'success',
        message: 'Document signed succesfuly!',
      })
      isSigned.value = true
    } catch (error) {
      console.error('Error signing document', error)
      emit('message', {
        type: 'error',
        message: 'Error signing document',
      })
    } finally {
      isSigning.value = false
      isSignDocumentFormOpen.value = false
    }
  } else {
    alert('Please upload a document to sign')
  }
}

const saveDocument = async () => {
  try {
    const response = await downloadDocument(signedDocumentId.value)

    const blob = new Blob([response.data], { type: 'application/zip' })

    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url

    a.download = 'document.zip'
    document.body.appendChild(a)
    a.click()

    setTimeout(() => {
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    }, 100)
  } catch (error) {
    console.error('Download failed:', error)
    emit('message', {
      type: 'error',
      message: error.response?.data?.message || 'Error downloading document',
    })
    throw error
  }
}

const removeFileInput = () => {
  file.value = null
  image.value = null
  isSigned.value = false
  isSigning.value = false
  fileInput.value.value = null
  signedDocumentId.value = null
}
</script>
