<template>
  <div class="grade-table">
    <h2>Your Grades</h2>
    <table v-if="grades.length > 0">
      <thead>
        <tr>
          <th>Course</th>
          <th>Grade</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="grade in grades" :key="grade.course">
          <td>{{ grade.course }}</td>
          <td>{{ grade.grade ?? 'N/A' }}</td>
          <td>{{ grade.grade != null ? 'Completed' : 'Pending' }}</td>
        </tr>
      </tbody>
    </table>
    <div v-else>No grades found.</div>
  </div>
</template>

<script setup>
defineProps({
  grades: {
    type: Array,
    required: true
  }
})
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background-color: #f0f0f0;
}

td,
th {
  padding: 0.5em;
  border: 1px solid #ddd;
}
</style>
