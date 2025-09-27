<template>
  <AppHeader></AppHeader>
  <AppEditProfileModal
    v-if="showEditModal"
    @close-modal="showEditModal = false"
  ></AppEditProfileModal>
  <AppDocumentModal
    v-if="showDocumentModal"
    @close-modal="showDocumentModal = false"
    :document="documentToView"
  ></AppDocumentModal>
  <AppUserProfile
    @editProfile="showEditModal = true"
    @viewDocument="handleView($event)"
  ></AppUserProfile>
</template>

<script setup>
import { ref } from 'vue'
import AppUserProfile from '@/components/AppUserProfile.vue'
import AppHeader from '@/components/AppHeader.vue'
import AppEditProfileModal from '@/components/AppEditProfileModal.vue'
import AppDocumentModal from '@/components/AppDocumentModal.vue'

const showEditModal = ref(false)
const showDocumentModal = ref(false)
const documentToView = ref({})

const handleView = (document) => {
  documentToView.value = document
  showDocumentModal.value = true
}
</script>
