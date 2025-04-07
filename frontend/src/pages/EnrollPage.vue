<template>
  <div>
    <h2>Enroll to Courses</h2>
    <p v-if="message" style="color: red">{{ message }}</p>
    <ul v-else class="course-list">
      <li v-for="course in courses" :key="course._id">
        {{ course.code }}
        <button @click="enroll(course.code)">Enroll</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const courses = ref([])
const message = ref('')

onMounted(async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      window.location.href = '/' // Redirect if not logged in
      return
    }

    const res = await fetch('http://localhost:8041/courselist', {
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
    message.value = `❌ ${err.message}`
  }
})

const enroll = async (courseCode) => {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      alert("You're not logged in.")
      return
    }

    const res = await fetch(`http://localhost:8042/enroll/${courseCode}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({}) // backend only needs param
    })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(text)
    }

    alert('✅ Enrolled successfully!')
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
</style>
