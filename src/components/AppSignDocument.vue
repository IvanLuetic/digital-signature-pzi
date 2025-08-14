<template>
  <div class="py-6 px-2 text-center">
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
        @drop.prevent="handleDrop"
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

        <input type="file" ref="fileInput" class="hidden" @change="handleFileSelect" />

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
        @click="signDocument"
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
import * as pdfjsLib from 'pdfjs-dist'
import { ref } from 'vue'
pdfjsLib.GlobalWorkerOptions.workerSrc = '../../node_modules/pdfjs-dist/build/pdf.worker.mjs'

const isUploading = ref(false)
const file = ref(null)
const isSigned = ref(false)
const isSigning = ref(false)

const image = ref(null)
const fileInput = ref(null)
const uploadArea = ref(null)
const pdfCanvas = ref(null)

const handleDrop = (event) => {
  const droppedFiles = event.dataTransfer.files
  handleFile(droppedFiles[0])
}

const handleFileSelect = (event) => {
  const selectedFile = event.target.files[0]

  if (selectedFile) {
    handleFile(selectedFile)
  }
}

const handleFile = (selectedFile) => {
  isUploading.value = true
  file.value = selectedFile
  if (file.value) {
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
    setTimeout(() => {
      isUploading.value = false
    }, 2000)
  }
}

const renderPDF = (pdfFile) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    const arrayBuffer = e.target.result
    const loadingTask = pdfjsLib.getDocument(arrayBuffer)
    loadingTask.promise
      .then((pdf) => {
        pdf.getPage(1).then((page) => {
          const scale = 1.5
          const viewport = page.getViewport({ scale: scale })

          const canvas = pdfCanvas.value
          const context = canvas.getContext('2d')

          canvas.width = viewport.width
          canvas.height = viewport.height

          page.render({ canvasContext: context, viewport: viewport }).promise.then(() => {
            console.log('PDF rendered as image')
          })
        })
      })
      .catch((error) => {
        console.error('Error loading PDF:', error)
      })
  }

  reader.readAsArrayBuffer(pdfFile)
}

const triggerFileInput = () => {
  fileInput.value.click()
}

const removeFileInput = () => {
  file.value = null
  image.value = null
  isSigned.value = false
  isSigning.value = false
  fileInput.value.value = null
}

const signDocument = async () => {
  if (file.value) {
    isSigning.value = true
    await new Promise((resolve) => {
      setTimeout(() => {
        isSigning.value = false
        if (file.value) {
          isSigned.value = true
        }
        resolve()
      }, 3000)
    })
  } else {
    alert('Please upload a document to sign')
  }
}

const saveDocument = async () => {
  if (file.value) {
    const url = URL.createObjectURL(file.value)
    const a = document.createElement('a')
    a.href = url
    a.download = file.value.name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
}
</script>
