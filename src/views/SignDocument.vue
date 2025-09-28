<template>
  <AppHeader></AppHeader>

  <AppError
    v-if="error || success"
    :error="error"
    :success="success"
    @close="clearError()"
    class="mx-auto"
  ></AppError>

  <SignDocument @message="handleMessage($event)"></SignDocument>
</template>

<script setup>
import AppError from '@/components/AppError.vue'
import AppHeader from '@/components/AppHeader.vue'
import SignDocument from '@/components/SignDocument.vue'
import { ref } from 'vue'

const error = ref('')
const success = ref('')
const handleMessage = (message) => {
  if (message.type == 'error') {
    error.value = message.message
  } else success.value = message.message
}
const clearError = () => {
  error.value = ''
  success.value = ''
}
</script>
