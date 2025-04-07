<template>
  <div>
    <h2>Upload Grades</h2>
    <select v-model="courseId">
      <option v-for="course in courses" :value="course.id">{{ course.name }}</option>
    </select>
    <input v-model="studentId" placeholder="Student ID" />
    <input v-model="grade" placeholder="Grade" />
    <button @click="uploadGrade">Upload</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const courseId = ref('')
const studentId = ref('')
const grade = ref('')
const courses = ref([])

onMounted(async () => {
  const res = await fetch('<COURSE_NODE>/api/faculty/courses')
  courses.value = await res.json()
})

const uploadGrade = async () => {
  const token = localStorage.getItem('token')
  await fetch('<GRADE_NODE>/api/faculty/upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      courseId: courseId.value,
      studentId: studentId.value,
      grade: grade.value
    })
  })
  alert('Grade uploaded.')
}
</script>
