<template>
  <div class="course-list">
    <h2>Available Courses</h2>
    <div v-if="courses.length === 0">No courses available.</div>
    <ul v-else>
      <li v-for="course in courses" :key="course.id" class="course-item">
        <div>
          <strong>{{ course.code }}</strong>
          <p>{{ course.description }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import axios from 'axios'

const props = defineProps({
  courses: Array,
})

const enroll = async (courseId) => {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/')
    }

    const res = await axios.post(`${import.meta.env.VITE_NODE_COURSELIST}/enroll`, { courseId }, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (res.status === 200) {
      alert('✅ Enrollment successful!')
    } else {
      alert('❌ Failed to enroll.')
    }
  } catch (err) {
    alert('❌ Error enrolling in course.')
    console.error(err)
  }
}
</script>

<style scoped>
.course-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1em;
  border-bottom: 1px solid #ccc;
  padding-bottom: 0.5em;
}
</style>
