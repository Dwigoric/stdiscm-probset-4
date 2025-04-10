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
    const isLoggedIn = computed(() => localStorage.getItem('token') !== null)

    const isFaculty = computed(() => {
      const token = localStorage.getItem('token')
      if (!token) return false
      const payload = JSON.parse(atob(token.split('.')[1])) // Decode JWT token to get payload
      return payload.role === 'faculty'
    })

    if (isFaculty.value) {
      window.location.href = '/faculty-upload'
    } else {
      window.location.href = '/courses'
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

