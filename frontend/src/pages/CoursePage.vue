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
      return
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
    if (err.name === 'TypeError' && err.message === 'Failed to fetch') {
      message.value = '⚠️ Service is down. Please try again later.'
    } else {
      message.value = `⚠️ Service unavailable.`
    }
  }
})
</script>

<template>
  <div>
    <template v-if="message">
      <div class="error-banner">{{ message }}</div>
      <h2>Available Courses</h2>
    </template>
    <template v-else>
      <h2>Available Courses</h2>
      <CourseList :courses="courses" />
    </template>
  </div>
</template>



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
