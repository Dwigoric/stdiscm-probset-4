<template>
  <div>
    <h2>Your Grades</h2>
    <GradeTable :grades="grades" />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import GradeTable from '../components/GradeTable.vue'

const grades = ref([])

onMounted(async () => {
  const token = localStorage.getItem('token')
  const res = await fetch('<GRADE_NODE>/api/student/grades', {
    headers: { Authorization: `Bearer ${token}` }
  })
  grades.value = await res.json()
})
</script>
