<template>
  <div>
    <template v-if="message">
      <div class="error-banner">{{ message }}</div>
      <h2>My Grades</h2>
    </template>
    <template v-else>
      <h2>My Grades</h2>
      <GradeTable grades="grades" />
    </template>
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
    message.value = `⚠️ Service unavailable.`
    console.error(err)
  }
})
</script>

<style scoped>
.error-banner {
  background-color: #ffcccc;
  color: #b30000;
  padding: 1em;
  font-weight: bold;
  text-align: center;
  border-bottom: 2px solid #b30000;
}
</style>
