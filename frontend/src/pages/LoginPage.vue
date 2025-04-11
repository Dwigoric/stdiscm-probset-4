<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const userId = ref('')
const password = ref('')
const router = useRouter()

const login = async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_NODE_AUTH}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: userId.value, password: password.value }),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.message || 'Login failed')
    }

    localStorage.setItem('token', data.token)

    const userRole = computed(() => {
    const token = localStorage.getItem('token')
    if (!token) return null
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload.role
    } catch (e) {
      return null
    }
  })

  const isStudent = computed(() => userRole.value === 'student')
  const isFaculty = computed(() => userRole.value === 'faculty')
  const isAdmin = computed(() => userRole.value === 'admin')

    if (isFaculty.value) {
      window.location.href = '/faculty-upload'
    } else if (isStudent.value) {
      window.location.href = '/courses'
    } else if (isAdmin.value) {
      window.location.href = '/create-user'
    } else {
      window.location.href = '/'
    }


  } catch (err) {
    alert(`❌ ${err.message}`)
  }
}
</script>


<template>
  <div class="login-page">
    <h2>Login</h2>
    <input v-model="userId" placeholder="User ID" />
    <input v-model="password" type="password" placeholder="Password" />
    <button @click="login">Login</button>
  </div>
</template>

