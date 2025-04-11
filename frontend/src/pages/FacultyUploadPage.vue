<template>
  <div>
    <div v-if="message" :class="{'error-banner': isError, 'success-banner': !isError}">
      {{ message }}
    </div>
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
import { onMounted, ref } from 'vue'

const courseCode = ref('')
const studentId = ref('')
const grade = ref('')
const courses = ref([])
const gradeOptions = [1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0]
const message = ref('')
const isError = ref(false)

onMounted(async () => {
  const token = localStorage.getItem('token') // ✅ FIXED: Define token first
  if (!token) {
    alert('You must be logged in.')
    return
  }

  try {
    const res = await fetch(`${import.meta.env.VITE_NODE_COURSELIST}/courselist`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!res.ok) {
      throw new Error('Service unavailable')
    }

    const data = await res.json()
    courses.value = data
  } catch (err) {
    message.value = '⚠️ Service unavailable.'
    isError.value = true
    console.error(err)
  }
})

const uploadGrade = async () => {
  const token = localStorage.getItem('token')
  if (!token) {
    message.value = '⚠️ You need to log in first!'
    isError.value = true
    return
  }

  console.log('Uploading grade:', {
    courseCode: courseCode.value,
    studentId: studentId.value,
    grade: Number(grade.value),
  })

  try {
    const response = await fetch(`${import.meta.env.VITE_NODE_UPLOADGRADE}/post-grade`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        courseCode: courseCode.value,
        studentId: studentId.value,
        grade: Number(grade.value),
      }),
    })

    if (response.ok) {
      message.value = '✅ Grade uploaded successfully.'
      isError.value = false
    } else {
      const err = await response.text()
      message.value = `❌ Error: ${err}`
      isError.value = true
    }
  } catch (err) {
    message.value = '⚠️ Service unavailable. Please try again later.'
    isError.value = true
    console.error(err)
  }
}
</script>

<style scoped>
/* Styling for the banner */
.error-banner {
  background-color: #ffcccc;
  color: #b30000;
  padding: 1em;
  font-weight: bold;
  text-align: center;
  border-bottom: 2px solid #b30000;
}

.success-banner {
  background-color: #d4edda;
  color: #155724;
  padding: 1em;
  font-weight: bold;
  text-align: center;
  border-bottom: 2px solid #155724;
}
</style>
