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

  try {
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
  } catch (err) {
    message.value = '⚠️ Service unavailable. Please try again later.'
    isError.value = true
    console.error(err)
  }
}
</script>

<template>
  <div class="create-user-page">
    <div v-if="message" :class="{'error-banner': isError, 'success-banner': !isError}">
      {{ message }}
    </div>
    <h2>Create New User</h2>
    <input v-model="userId" placeholder="User ID" />
    <input v-model="password" type="password" placeholder="Password" />
    <select v-model="role">
      <option disabled value="">Select Role</option>
      <option value="student">Student</option>
      <option value="faculty">Faculty</option>
    </select>
    <button @click="createUser">Create</button>
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
