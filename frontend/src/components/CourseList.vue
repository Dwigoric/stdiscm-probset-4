<template>
  <div class="course-list">
    <h2>Available Courses</h2>
    <div v-if="courses.length === 0">No courses available.</div>
    <ul v-else>
      <li v-for="course in courses" :key="course.id" class="course-item">
        <div>
          <strong>{{ course.code }}</strong> - {{ course.name }}
          <p>{{ course.description }}</p>
        </div>
        <button @click="enroll(course.id)">Enroll</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const courses = ref([])

onMounted(async () => {
  try {
    const response = await axios.get('http://your-api-node/courses')
    courses.value = response.data
  } catch (err) {
    console.error('Failed to fetch courses:', err)
  }
})

const enroll = async (courseId) => {
  try {
    await axios.post(`http://your-api-node/enroll`, { courseId })
    alert('Enrollment successful!')
  } catch (err) {
    alert('Failed to enroll.')
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
