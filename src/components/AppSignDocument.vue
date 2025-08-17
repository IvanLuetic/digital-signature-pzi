<template>
  <div class="py-6 px-0 text-center">
    <h1 class="font-bold mb-2 mx-auto">Upload document to sign</h1>
    <h4 class="text-gray-800 max-w-160 mx-auto">
      Click below to upload your document or drag and drop it here. Accepted file formats: PDF, JPG,
      PNG, DOCX
    </h4>
  </div>

  <div class="flex flex-col items-center gap-8 mx-4 pb-30">
    <div class="w-full md:w-3/5 lg:w-2/5 flex justify-center items-center border-2 border-dashed">
      <div
        ref="uploadArea"
        class="flex flex-col justify-around items-center min-h-[40vh] w-full border-gray-500 relative bg-stone-300"
        :class="{ 'animate-pulse scale-[1.01]': isUploading }"
        @dragover.prevent
        @dragenter.prevent
        @drop.prevent="handleFile"
      >
        <div v-if="isSigning" class="flex justify-center">
          <div class="w-full flex justify-center relative">
            <p class="absolute z-10 font-bold">Signing your document...</p>
            <div
              class="my-6 absolute bg-blue-500 h-4 rounded animate-pulse"
              style="top: 32%; left: 50%; transform: translate(-50%, -50%); width: 14vw"
            ></div>
          </div>
        </div>
        <i v-if="!file" class="mdi mdi-cloud-upload text-6xl"></i>
        <div v-if="!file" class="text-2xl text-gray-800 text-center">
          Drag & Drop <br />
          OR <br />
        </div>
        <img
          v-if="image"
          :src="image"
          alt="Uploaded Document"
          :class="[
            isSigning
              ? 'blur-sm w-full absolute h-full bg-cover bg-center'
              : 'blur-xs w-full  absolute h-full bg-cover bg-center',
          ]"
        />
        <canvas
          v-if="file && !image"
          ref="pdfCanvas"
          class="min-h-[40vh] w-full absolute h-full"
          style="filter: blur(1px)"
        ></canvas>

        <input type="file" ref="fileInput" class="hidden" @change="handleFile" />

        <div class="z-50">
          <button
            class="bg-gray-200 hover:bg-gray-300 py-2 px-6 rounded text-lg border border-black shadow-md cursor-pointer"
            v-if="!file"
            @click="triggerFileInput"
          >
            SELECT FILE
          </button>
          <button
            class="bg-gray-200 hover:bg-gray-300 py-2 px-6 rounded text-lg border border-black shadow-md cursor-pointer"
            v-else
            @click="removeFileInput"
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
    <div class="relative bottom-6">
      <p v-if="file">{{ file.name }} selected</p>
    </div>

    <div v-if="!isSigned" class="flex items-center justify-center">
      <button
        @click="handleSignDocument"
        class="bg-gradient-to-r absolute from-blue-500 to-blue-600 text-gray-200 hover:from-blue-700 hover:to-blue-800 w-50 text-2xl font-semibold py-6 rounded-full border-1 border-black shadow-xl hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer"
      >
        Sign document
      </button>
    </div>
    <div v-else class="flex items-center justify-center">
      <button
        @click="saveDocument"
        class="bg-gradient-to-r absolute from-blue-500 to-blue-600 text-gray-200 hover:from-blue-700 hover:to-blue-800 text-2xl font-semibold py-6 px-7 rounded-full border-1 border-black shadow-xl hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer"
      >
        Download <i class="mdi mdi-download text-2xl mt-1"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { signDocument } from '@/api/document'
import * as pdfjsLib from 'pdfjs-dist'
import { ref } from 'vue'
pdfjsLib.GlobalWorkerOptions.workerSrc = '../../node_modules/pdfjs-dist/build/pdf.worker.mjs'

const isUploading = ref(false)
const file = ref(null)
const isSigned = ref(false)
const isSigning = ref(false)
const signedDoc = ref(null)

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
      file.value.type === 'application/pdf' ||
      file.value.name.endsWith('.docx'))
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
    alert('Allowed file types are .png, .jpg .pdf and .docx')
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

const handleSignDocument = async () => {
  if (file.value) {
    isSigning.value = true
    try {
      const fileData = new FormData()
      fileData.append('file', file.value)
      signedDoc.value = await signDocument(fileData)
      console.log('Signed document: ', signedDoc.value)
      isSigned.value = true
    } catch (error) {
      console.error('Error signing document', error)
    } finally {
      isSigning.value = false
    }
  } else {
    alert('Please upload a document to sign')
  }
}

const saveDocument = async () => {
  if (signedDoc.value) {
    try {
      // convert Buffer data to a Blob
      const byteArray = new Uint8Array(signedDoc.value.file.buffer.data)
      const blob = new Blob([byteArray], { type: signedDoc.value.file.mimetype })

      // Create download link
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = signedDoc.value.file.originalname
      document.body.appendChild(a)
      a.click()

      setTimeout(() => {
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
      }, 100)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }
}
const removeFileInput = () => {
  file.value = null
  image.value = null
  isSigned.value = false
  isSigning.value = false
  fileInput.value.value = null
  signedDoc.value = null
}
</script>
