<template>
  <div>
    <h2>Available Courses</h2>
    <CourseList :courses="courses" />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import CourseList from '../components/CourseList.vue'

const courses = ref([])

onMounted(async () => {
  const res = await fetch('<COURSE_NODE>/api/courses')
  courses.value = await res.json()
})
</script>
