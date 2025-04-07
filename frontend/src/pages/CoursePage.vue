<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

import CourseList from '../components/CourseList.vue'

const courses = ref([])
const message = ref('')

onMounted(async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/')
    }

    const res = await fetch('http://localhost:8041/courselist', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    
    if (!res.ok) {
      throw new Error('Failed to fetch courses')
    }

    const data = await res.json()
    courses.value = data

  } catch (err) {
    message.value = `❌ ${err.message}`
  }
})
</script>

<template>
  <div>
    <div v-if="message">{{ message }}</div>
    <CourseList :courses="courses" />
  </div>
</template>
