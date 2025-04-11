<template>
  <nav class="navbar">
    <router-link v-if="!isLoggedIn" to="/" class="nav-link">Home</router-link>

    <!-- Student view -->
    <router-link v-if="isStudent && isLoggedIn" to="/courses" class="nav-link">All Courses</router-link>
    <router-link v-if="isStudent && isLoggedIn" to="/my-courses" class="nav-link">My Courses</router-link>
    <router-link v-if="isStudent && isLoggedIn" to="/enroll" class="nav-link">Enroll</router-link>
    <router-link v-if="isStudent && isLoggedIn" to="/grades" class="nav-link">Grades</router-link>

    <!-- Faculty view -->
    <router-link v-if="isFaculty && isLoggedIn" to="/faculty-upload" class="nav-link">Upload Grades</router-link>

    <!-- Admin view -->
    <router-link v-if="isAdmin && isLoggedIn" to="/create-user" class="nav-link">Create user</router-link>
    <router-link v-if="isAdmin && isLoggedIn" to="/create-course" class="nav-link">Create course</router-link>

    <button v-if="isLoggedIn " @click="handleAuth" class="logout-btn">
      Logout
    </button>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, computed } from 'vue'

const router = useRouter()

const isLoggedIn = computed(() => localStorage.getItem('token') !== null)

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
