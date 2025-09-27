<template>
  <AppHeader></AppHeader>
  <div class="flex justify-center">
    <AppError
      v-if="error || success"
      :error="error"
      :success="success"
      @close="clearError()"
    ></AppError>
  </div>
  <AppSignDocument @message="handleMessage($event)"></AppSignDocument>
</template>

<script setup>
import AppError from '@/components/AppError.vue'
import AppHeader from '@/components/AppHeader.vue'
import AppSignDocument from '@/components/AppSignDocument.vue'
import { ref } from 'vue'

const error = ref('')
const success = ref('')
const handleMessage = (message) => {
  if (message.type == 'error') {
    error.value = message.message
  } else success.value = message.message
}
const clearError = () => (error.value = '')
</script>
