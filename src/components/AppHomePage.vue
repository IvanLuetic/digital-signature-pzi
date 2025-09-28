<template>
  <div class="relative h-[100vh] overflow-hidden mt-0 -mx-4 shadow-lg shadow-black/40">
    <div class="absolute inset-0 bg-black/70"></div>
    <img
      src="https://www.shutterstock.com/image-photo/businessman-using-paperless-electronic-signature-600nw-2481260731.jpg"
      alt="Digital Signature"
      class="w-full h-full object-cover"
    />

    <div class="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-2">
      <h1 class="text-white font-bold mb-4 leading-tight">
        Sign your documents easily and securely
      </h1>
      <p class="text-white text-lg md:text-xl mb-8 max-w-2xl opacity- mx-2">
        Easily authenticate and protect your contracts and agreements with a secure, digital
        signature—no physical paperwork required.
      </p>

      <router-link :to="userStore.currentUser ? '/sign' : '/auth'">
        <button
          class="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-600 hover:to-blue-700 text-white flex items-center justify-center gap-2 text-2xl sm:text-3xl font-semibold py-8 px-10 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 cursor-pointer"
        >
          Get started
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 transform mt-1 transition-transform duration-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </button>
      </router-link>
    </div>
  </div>

  <div id="about" class="mx-auto px-4 pt-6">
    <h2 class="text-2xl md:text-3xl font-bold text-center mb-6">How it works</h2>
    <div class="bg-white max-w-4xl mx-auto border border-gray-300 rounded-lg p-4 md:p-8 shadow-md">
      <div class="mb-6 md:mb-8">
        <div class="flex flex-col sm:flex-row sm:items-start">
          <div class="flex items-center mb-4">
            <h4 class="font-bold mr-3">1. Upload Your Document</h4>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-8 w-8 md:h-6 md:w-6 text-blue-600 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>
        </div>
        <p class="text-gray-700 sm:ml-8">
          Drag and drop or select the file you want to sign from your device. We accept a variety of
          file types, including PNG, JPG, and PDF.
        </p>
      </div>

      <div class="mb-6 md:mb-8">
        <div class="flex flex-col sm:flex-row sm:items-start">
          <div class="flex items-center mb-4">
            <h4 class="font-bold mr-3">2. Authenticate and Sign</h4>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-8 w-8 md:h-6 md:w-6 text-blue-600 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </div>
        </div>
        <p class="text-gray-700 sm:ml-8">
          Once the document is uploaded, our app uses PGP encryption to add a unique digital
          signature. This cryptographic signature ensures that the document is valid and hasn't been
          altered.
        </p>
      </div>

      <div>
        <div class="flex flex-col sm:flex-row sm:items-start">
          <div class="flex items-center mb-4">
            <h4 class="font-bold mr-3">3. Download Your Signed Document</h4>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-8 w-8 md:h-6 md:w-6 text-blue-600 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
          </div>
        </div>
        <p class="text-gray-700 sm:ml-8">
          After signing, download the document with your secure digital signature. It's ready for
          sharing or official use.
        </p>
      </div>
    </div>
  </div>

  <div class="px-4 py-16 max-w-7xl mx-auto">
    <h2 class="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-900">
      Why use our digital signature app?
    </h2>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
      <div class="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div class="flex items-center mb-4">
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
            <svg
              class="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900">Secure & Legally Binding</h3>
        </div>
        <p class="text-gray-600 leading-relaxed">
          Your signature is verified using PGP encryption, making sure that no one can alter your
          signed document. Only you have access to your unique private key.
        </p>
      </div>

      <div class="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div class="flex items-center mb-4">
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
            <svg
              class="w-6 h-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900">Fast & Easy</h3>
        </div>
        <p class="text-gray-600 leading-relaxed">
          Say goodbye to printing and scanning. With just a few clicks, your document is digitally
          signed, saving you time and effort.
        </p>
      </div>

      <div class="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div class="flex items-center mb-4">
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
            <svg
              class="w-6 h-6 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900">Legally Binding</h3>
        </div>
        <p class="text-gray-600 leading-relaxed">
          A digital signature created using PGP is recognized as legally binding in many
          jurisdictions, ensuring that your signed documents are valid for legal purposes.
        </p>
      </div>
    </div>
  </div>

  <footer class="bg-gray-200 py-8 mt-auto">
    <div class="flex justify-center space-x-4 mb-4 text-center">
      <a href="#" class="text-gray-700 hover:text-blue-600">Terms of Service</a>
      <a href="#" class="text-gray-700 hover:text-blue-600">Privacy Policy</a>
      <a href="#" class="text-gray-700 hover:text-blue-600">Contact</a>
    </div>
    <div class="text-gray-600 text-center">
      © {{ new Date().getFullYear() }} — University of Mostar
    </div>
  </footer>
</template>

<script setup>
import { useUserStore } from '../stores/user.js'

const userStore = useUserStore()
</script>
