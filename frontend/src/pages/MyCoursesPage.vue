<template>
  <div>
    <!-- Service Down Banner -->
    <div v-if="message" class="banner">
      {{ message }}
    </div>

    <h2>My Enrolled Courses</h2>
    <ul v-if="!message" class="course-list">
      <li v-for="course in enrolledCourses" :key="course._id">
        {{ course.code }}
        <button @click="unenroll(course.code)">Unenroll</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const enrolledCourses = ref([])
const message = ref('')

const fetchEnrolled = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      window.location.href = '/'
      return
    }

    const res = await fetch(`${import.meta.env.VITE_NODE_ENROLL}/enrolled`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!res.ok) throw new Error('Failed to fetch enrolled courses')

    const data = await res.json()
    enrolledCourses.value = data
  } catch (err) {
    message.value = `⚠️ Service unavailable.`
  }
}

const unenroll = async (courseCode) => {
  try {
    const token = localStorage.getItem('token')

    const res = await fetch(`${import.meta.env.VITE_NODE_ENROLL}/unenroll/${courseCode}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(text)
    }

    alert('✅ Unenrolled successfully!')
    await fetchEnrolled() // Refresh the list after unenrolling
  } catch (err) {
    alert(`❌ ${err.message}`)
  }
}

onMounted(fetchEnrolled)
</script>

<style scoped>
.course-list {
  list-style-type: none;
  padding: 0;
}

.course-list li {
  margin-bottom: 1em;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.banner {
  background-color: #ffdddd;
  color: #a94442;
  padding: 1em;
  border: 1px solid #a94442;
  border-radius: 5px;
  margin-bottom: 1em;
  font-weight: bold;
  text-align: center;
}
</style>
