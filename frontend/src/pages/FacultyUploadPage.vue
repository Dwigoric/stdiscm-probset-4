<template>
  <div>
    <h2>Upload Grades</h2>
    <select v-model="courseCode">
      <option v-for="course in courses" :value="course.code">{{ course.code }}</option>
    </select>
    <input v-model="studentId" placeholder="Student ID" />

    <select v-model="grade">
      <option disabled value="">Select Grade</option>
      <option v-for="g in gradeOptions" :key="g" :value="g">{{ g }}</option>
    </select>

    <button @click="uploadGrade">Upload</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const courseCode = ref('')
const studentId = ref('')
const grade = ref('')
const courses = ref([])
const gradeOptions = [1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0]

onMounted(async () => {
  const token = localStorage.getItem('token') // ✅ FIXED: Define token first
  if (!token) {
    alert('You must be logged in.')
    return
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
})

const uploadGrade = async () => {
  const token = localStorage.getItem('token')
  if (!token) {
    alert('You need to log in first!')
    return
  }

  console.log('Uploading grade:', {
    courseCode: courseCode.value,
    studentId: studentId.value,
    grade: Number(grade.value)
  })


  const response = await fetch('http://localhost:8044/post-grade', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      courseCode: courseCode.value,
      studentId: studentId.value,
      grade: Number(grade.value)
    })
  })

  if (response.ok) {
    alert('Grade uploaded successfully.')
  } else {
    const err = await response.text()
    alert(`Error: ${err}`)
  }
}
</script>
