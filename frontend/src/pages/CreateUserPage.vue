<script setup>
import { ref } from 'vue'

const userId = ref('')
const password = ref('')
const role = ref('')
const message = ref('')
const isError = ref(false)

const createUser = async () => {
  const token = localStorage.getItem('token')
  if (!token) {
    message.value = '⚠️ You must be logged in as admin.'
    isError.value = true
    return
  }

  const res = await fetch(`${import.meta.env.VITE_NODE_AUTH}/create_user`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      userId: userId.value,
      password: password.value,
      role: role.value
    })
  })

  const data = await res.json()

  if (res.ok) {
    message.value = `✅ ${data.message}`
    isError.value = false
    userId.value = ''
    password.value = ''
    role.value = ''
  } else {
    message.value = `❌ ${data.message || 'Something went wrong'}`
    isError.value = true
  }
}
</script>

<template>
  <div class="login-page">
    <h2>Create New User</h2>
    <input v-model="userId" placeholder="User ID" />
    <input v-model="password" type="password" placeholder="Password" />
    <select v-model="role">
      <option disabled value="">Select Role</option>
      <option value="student">Student</option>
      <option value="faculty">Faculty</option>
    </select>
    <button @click="createUser">Create</button>

    <p v-if="message" :style="{ color: isError ? 'red' : 'green', marginTop: '0.5rem' }">
      {{ message }}
    </p>
  </div>
</template>

<style scoped>
.login-page {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 300px;
  margin: 2rem auto;
}

input,
select {
  padding: 0.5rem;
  font-size: 1rem;
}

button {
  padding: 0.5rem;
  font-weight: bold;
  background-color: #2e7d32;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #1b5e20;
}
</style>
