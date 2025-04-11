<script setup>
import { ref } from 'vue'

const courseCode = ref('')
const message = ref('')
const isError = ref(false)
const isServiceUnavailable = ref(false)

const createCourse = async () => {
  const token = localStorage.getItem('token')
  if (!token) {
    message.value = '⚠️ You must be logged in as admin.'
    isError.value = true
    return
  }

  if (!courseCode.value) {
    message.value = '⚠️ Course Code is required.'
    isError.value = true
    return
  }

  try {
    const res = await fetch(`${import.meta.env.VITE_NODE_COURSELIST}/create_course`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        code: courseCode.value
      })
    })

    // If the backend is down or not reachable, handle that error
    if (!res.ok) {
      if (res.status === 503) {
        isServiceUnavailable.value = true
        message.value = '⚠️ Service Unavailable. Please try again later.'
        isError.value = true
      } else {
        const data = await res.json()
        message.value = `❌ ${data.message || 'Something went wrong'}`
        isError.value = true
      }
      return
    }

    const data = await res.json()

    if (res.ok) {
      message.value = `✅ ${data.message}`
      isError.value = false
      courseCode.value = ''
    } else {
      message.value = `❌ ${data.message || 'Something went wrong'}`
      isError.value = true
    }
  } catch (err) {
    isServiceUnavailable.value = true
    message.value = '⚠️ Service Unavailable. Please try again later.'
    isError.value = true
    console.error(err)
  }
}
</script>

<template>
  <div class="create-course-page">
    <!-- Service Unavailable Banner -->
    <div v-if="isServiceUnavailable" class="error-banner">
      ⚠️ Service is currently unavailable. Please try again later.
    </div>

    <!-- Error or Success Banner -->
    <div v-if="message" :class="{'error-banner': isError, 'success-banner': !isError}">
      {{ message }}
    </div>

    <h2>Create New Course</h2>
    <input v-model="courseCode" placeholder="Course Code" />
    <button @click="createCourse">Create Course</button>
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

.success-banner {
  background-color: #d4edda;
  color: #155724;
  padding: 1em;
  font-weight: bold;
  text-align: center;
  border-bottom: 2px solid #155724;
}
</style>
