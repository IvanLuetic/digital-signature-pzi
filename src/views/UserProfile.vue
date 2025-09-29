<template>
  <AppHeader></AppHeader>
  <EditProfileModal v-if="showEditModal" @close-modal="showEditModal = false"></EditProfileModal>
  <DocumentModal
    v-if="showDocumentModal"
    @close-modal="showDocumentModal = false"
    :id="documentId"
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
const documentId = ref({})

const handleView = (id) => {
  documentId.value = id
  showDocumentModal.value = true
}
</script>
