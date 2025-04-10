<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import CourseList from '../components/CourseList.vue'

const router = useRouter()

const courses = ref([])
const message = ref('')

onMounted(async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      window.location.href = '/'
    }

    const res = await fetch(`${import.meta.env.VITE_NODE_COURSELIST}/courselist`, {
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
