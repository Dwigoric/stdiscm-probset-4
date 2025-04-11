<template>
  <div>
    <!-- Service Down Banner -->
    <div v-if="message" class="banner">
      {{ message }}
    </div>

    <h2>Enroll to Courses</h2>
    <ul v-if="!message" class="course-list">
      <li v-for="course in courses" :key="course._id">
        {{ course.code }}
        <button
          :disabled="isAlreadyEnrolled(course.code)"
          :class="{ enrolled: isAlreadyEnrolled(course.code) }"
          @click="enroll(course.code)"
        >
          {{ isAlreadyEnrolled(course.code) ? 'Enrolled' : 'Enroll' }}
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const courses = ref([])
const enrolledCourses = ref([])
const message = ref('')

const isAlreadyEnrolled = (code) => {
  return enrolledCourses.value.includes(code)
}

onMounted(async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      window.location.href = '/'
      return
    }

    // Fetch all available courses
    const resCourses = await fetch(`${import.meta.env.VITE_NODE_COURSELIST}/courselist`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!resCourses.ok) throw new Error('Failed to fetch course list')
    courses.value = await resCourses.json()

    // Fetch user's enrolled courses
    const resEnrolled = await fetch(`${import.meta.env.VITE_NODE_ENROLL}/enrolled`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!resEnrolled.ok) throw new Error('Failed to fetch enrolled courses')
    const enrolledData = await resEnrolled.json()
    enrolledCourses.value = enrolledData.map(c => c.code)

  } catch (err) {
    message.value = `⚠️ Service unavailable.`
  }
})

const enroll = async (courseCode) => {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      alert('You\'re not logged in.')
      return
    }

    const res = await fetch(`${import.meta.env.VITE_NODE_ENROLL}/enroll/${courseCode}`, {
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

    alert('✅ Enrolled successfully!')
    enrolledCourses.value.push(courseCode)
  } catch (err) {
    alert(`❌ ${err.message}`)
  }
}
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

button.enrolled {
  background-color: #ffdddd;
  color: red;
  cursor: not-allowed;
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
