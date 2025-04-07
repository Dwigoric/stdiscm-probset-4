<template>
  <nav class="navbar">
    <router-link v-if="!isLoggedIn" to="/" class="nav-link">Home</router-link>

    <router-link v-if="!isFaculty && isLoggedIn" to="/courses" class="nav-link">Courses</router-link>
    <router-link v-if="!isFaculty && isLoggedIn" to="/enroll" class="nav-link">Enroll</router-link>
    <router-link v-if="!isFaculty && isLoggedIn" to="/grades" class="nav-link">Grades</router-link>
    <router-link v-if="isFaculty && isLoggedIn" to="/faculty-upload" class="nav-link">Faculty</router-link>

    <button v-if="isLoggedIn " @click="handleAuth" class="logout-btn">
      Logout
    </button>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, computed } from 'vue'

const router = useRouter()

// Check if the user is logged in by checking the token
const isLoggedIn = computed(() => localStorage.getItem('token') !== null)

// Extract the user role from the JWT token stored in localStorage
const isFaculty = computed(() => {
  const token = localStorage.getItem('token')
  if (!token) return false
  const payload = JSON.parse(atob(token.split('.')[1])) // Decode JWT token to get payload
  return payload.role === 'faculty'
})

const handleAuth = () => {
  if (isLoggedIn.value) {
    // Perform logout
    localStorage.removeItem('token')
    window.location.href = '/'
  }
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  padding: 0.5rem 2rem;
}

.nav-link {
  color: #ecf0f1;
  text-decoration: none;
  padding: 0.5rem 1rem;
  margin-right: 1.5rem;
  border-radius: 4px;
  transition: background-color 0.2s ease-in-out;
}

.nav-link:hover {
  background-color: #34495e;
}

.logout-btn {
  background-color: #e74c3c;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
}

.logout-btn:hover {
  background-color: #c0392b;
}
</style>
