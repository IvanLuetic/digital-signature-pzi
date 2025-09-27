<template>
  <div
    v-if="success || error"
    :class="error ? 'bg-red-500' : 'bg-green-500'"
    class="fixed left-1/2 top-0 transform -translate-x-1/2 mt-9 max-w-md mx-4 rounded-lg px-4 py-3 shadow-lg text-white font-medium flex items-center z-100"
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
        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      ></path>
    </svg>
    {{ success || error }}
    <button @click="$emit('close')" class="ml-3">
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
</script>
