<template>
  <div
    v-if="currentMessage"
    :class="currentType === 'error' ? 'bg-red-500' : 'bg-green-500'"
    class="fixed left-1/2 top-0 transform -translate-x-1/2 mt-9 max-w-md mx-4 sm:mx-0 rounded-lg px-4 py-3 shadow-lg text-white font-medium flex items-center z-200 transition-all duration-300"
  >
    <svg
      class="w-5 h-5 mr-3 cursor-pointer"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        :d="
          currentType === 'error'
            ? 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
            : 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
        "
      ></path>
    </svg>
    {{ currentMessage }}
    <button @click="closeMessage" class="ml-3">
      <svg
        class="w-4 h-4 cursor-pointer"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        ></path>
      </svg>
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const { error, success } = defineProps({
  error: {
    type: String,
    default: null,
  },
  success: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(['close'])

const currentMessage = computed(() => error || success)
const currentType = computed(() => (error ? 'error' : success ? 'success' : ''))

const closeMessage = () => {
  emit('close')
}
</script>
