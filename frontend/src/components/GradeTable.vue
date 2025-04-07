<template>
  <div class="grade-table">
    <h2>Your Grades</h2>
    <table v-if="grades.length > 0">
      <thead>
        <tr>
          <th>Course</th>
          <th>Grade</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="grade in grades" :key="grade.course">
          <td>{{ grade.course }}</td>
          <td>{{ grade.grade ?? 'N/A' }}</td>
        </tr>
      </tbody>
    </table>
    <div v-else class="no-grades">No grades found.</div>
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
.grade-table {
  max-width: 600px;
  margin: 2rem auto;
  padding: 1rem;
  font-family: 'Segoe UI', sans-serif;
  color: #f0f0f0;
}

h2 {
  text-align: center;
  margin-bottom: 1rem;
  color: #f0f0f0;
}

table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 1rem;
  background-color: transparent;
}

thead {
  background-color: rgba(255, 255, 255, 0.05);
}

th,
td {
  padding: 0.75em 1em;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

th {
  color: #ccc;
  font-weight: 600;
}

tbody tr:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.no-grades {
  text-align: center;
  padding: 1em;
  color: #aaa;
  font-style: italic;
}
</style>
