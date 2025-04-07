<template>
  <nav class="navbar">
    <router-link to="/courses" class="nav-link">Courses</router-link>
    <router-link to="/enroll" class="nav-link">Enroll</router-link>
    <router-link to="/grades" class="nav-link">Grades</router-link>
    <router-link to="/faculty-upload" class="nav-link">Faculty</router-link>
    <button @click="logout" class="logout-btn">Logout</button>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

const logout = () => {
  localStorage.removeItem('token')
  router.push('/')
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 2rem;
}

.nav-link {
  color: #ecf0f1;
  text-decoration: none;
  padding: 0.5rem 1rem;
  margin-right: 1.5rem; /* Added space between links */
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
