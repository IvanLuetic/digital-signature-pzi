<template>
  <div
    class="fixed inset-0 bg-black/70 flex items-center justify-center z-100 backdrop-blur-sm p-4 pt-10 sm:pt-0"
  >
    <div
      class="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 transform transition-all duration-300"
    >
      <div class="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-t-xl">
        <h2 class="text-xl font-semibold flex items-center gap-2">Sign Document</h2>
        <p class="text-blue-100 text-sm mt-1">
          Enter your credentials to digitally sign this document
        </p>
      </div>

      <div class="p-6 space-y-5">
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            v-model="password"
            id="password"
            type="password"
            placeholder="Enter your password"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
        </div>

        <div>
          <label for="keySelection" class="block text-sm font-medium text-gray-700 mb-2">
            Select Signing Key
          </label>
          <select
            id="keySelection"
            v-model="selectedKey"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          >
            <option value="" disabled>Choose a signing key</option>
            <option v-for="key in keys" :key="key.id" :value="key.id">
              {{ `Key ${key.id}` }}
            </option>
          </select>
        </div>
        <div class="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
          <div class="flex flex-col gap-3">
            <div class="flex flex-row gap-2 items-center">
              <svg
                class="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                ></path>
              </svg>

              <h4 class="font-medium text-blue-800">Security Notice</h4>
            </div>
            <span class="text-md text-blue-700 -mt-2">
              This document will be signed with your private PGP key. Any modifications to the
              document will invalidate the signature.
            </span>
          </div>
        </div>
      </div>
      <div class="bg-gray-50 rounded-b-xl px-6 pb-4 flex gap-3 justify-end">
        <button
          @click="$emit('close')"
          class="px-4 text-gray-700 cursor-pointer border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-medium"
        >
          Cancel
        </button>
        <button
          @click="handleSign"
          :disabled="!password || !selectedKey"
          class="px-4 py-2 bg-blue-600 cursor-pointer text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            ></path>
          </svg>
          Sign Document
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['close', 'sign'])

const { keys } = defineProps({
  keys: {
    type: Array,
  },
})
const password = ref('')
const selectedKey = ref(null)

const handleSign = () => {
  emit('sign', { password: password.value, public_key_id: selectedKey.value })
}
</script>
