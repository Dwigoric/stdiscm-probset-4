<template>
  <div>
    <h2>Enroll to Courses</h2>
    <ul>
      <li v-for="course in courses" :key="course.id">
        {{ course.name }}
        <button @click="enroll(course.id)">Enroll</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const courses = ref([])

onMounted(async () => {
  const res = await fetch('<COURSE_NODE>/api/courses/open')
  courses.value = await res.json()
})

const enroll = async (courseId) => {
  const token = localStorage.getItem('token')
  await fetch(`<ENROLL_NODE>/api/enroll/${courseId}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  })
  alert('Enrolled!')
}
</script>
