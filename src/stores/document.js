import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useDocumentStore = defineStore('document', () => {
  const documents = ref([])
  const filter = ref('')
  const filteredDocuments = computed(() => {
    if (!filter.value) return documents.value

    return documents.value.filter((document) =>
      document.signed_file_url.toLowerCase().includes(filter.value.toLowerCase()),
    )
  })

  return { documents, filteredDocuments, filter }
})
