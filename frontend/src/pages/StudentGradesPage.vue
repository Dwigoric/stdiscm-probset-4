<template>
  <div>
    <GradeTable :grades="grades" />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import GradeTable from '../components/GradeTable.vue'

const grades = ref([])
const message = ref('')

onMounted(async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      window.location.href = '/'
      return
    }

    const res = await fetch(`${import.meta.env.VITE_NODE_VIEWGRADE}/grades`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    const data = await res.json()
    grades.value = data.grades
  } catch (err) {
    message.value = `❌ ${err.message}`
    console.error(err)
  }
})
</script>
