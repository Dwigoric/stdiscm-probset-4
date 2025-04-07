<template>
  <nav class="navbar">
    <router-link to="/courses" class="nav-link">Courses</router-link>
    <router-link to="/enroll" class="nav-link">Enroll</router-link>
    <router-link to="/grades" class="nav-link">Grades</router-link>
    <router-link to="/faculty-upload" class="nav-link">Faculty</router-link>
    
    <!-- Conditional rendering based on token presence -->
    <button v-if="isLoggedIn" @click="handleAuth" class="logout-btn">
      Logout
    </button>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, computed } from 'vue'

const router = useRouter()

const isLoggedIn = computed(() => localStorage.getItem('token') !== null)

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
  justify-content: space-between;
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
