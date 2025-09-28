<template>
  <AppHeader></AppHeader>
  <EditProfileModal v-if="showEditModal" @close-modal="showEditModal = false"></EditProfileModal>
  <DocumentModal
    v-if="showDocumentModal"
    @close-modal="showDocumentModal = false"
    :document="documentToView"
  ></DocumentModal>
  <UserProfile @editProfile="showEditModal = true" @viewDocument="handleView($event)"></UserProfile>
</template>

<script setup>
import { ref } from 'vue'
import UserProfile from '@/components/UserProfile.vue'
import AppHeader from '@/components/AppHeader.vue'
import EditProfileModal from '@/components/EditProfileModal.vue'
import DocumentModal from '@/components/DocumentModal.vue'

const showEditModal = ref(false)
const showDocumentModal = ref(false)
const documentToView = ref({})

const handleView = (document) => {
  documentToView.value = document
  showDocumentModal.value = true
}
</script>
