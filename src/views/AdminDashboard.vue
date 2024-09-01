<script setup>
import { ref, onMounted } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

const users = ref([])

onMounted(() => {
  const storedUsers = JSON.parse(localStorage.getItem('submittedCards')) || []
  users.value = storedUsers
})
</script>

<template>
  <div class="container mt-5">
    <h1 class="text-center">Admin Page</h1>
    <p class="text-center">Welcome to Admin Dashboard.</p>
    <p class="text-center">Here are the users who signed up:</p>

    <div class="row mt-5">
      <h4>This is a PrimeVue Datatable.</h4>
      <DataTable :value="users" tableStyle="min-width: 50rem">
        <Column field="username" header="Username"></Column>
        <Column field="password" header="Password"></Column>
        <Column field="isAustralian" header="Australian Resident"></Column>
        <Column field="gender" header="Gender"></Column>
        <Column field="reason" header="Reason"></Column>
      </DataTable>
    </div>

    <div class="row mt-5" v-if="users.length">
      <div class="d-flex flex-wrap justify-content-start">
        <div v-for="(user, index) in users" :key="index" class="card m-2" style="width: 18rem">
          <div class="card-header">User Information</div>
          <ul class="list-group list-group-flush">
            <li class="list-group-item">Username: {{ user.username }}</li>
            <li class="list-group-item">Password: {{ user.password }}</li>
            <li class="list-group-item">
              Australian Resident: {{ user.isAustralian ? 'Yes' : 'No' }}
            </li>
            <li class="list-group-item">Gender: {{ user.gender }}</li>
            <li class="list-group-item">Reason: {{ user.reason }}</li>
          </ul>
        </div>
      </div>
    </div>
    <div v-else>
      <p>No users have signed up yet.</p>
    </div>
  </div>
</template>

<style scoped>
.container {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  max-width: 80vw;
  margin: 0 auto;
  padding: 20px;
}

.card {
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-header {
  background-color: #275fda;
  color: white;
  padding: 10px;
  border-radius: 10px 10px 0 0;
}

.list-group-item {
  padding: 10px;
}
</style>
