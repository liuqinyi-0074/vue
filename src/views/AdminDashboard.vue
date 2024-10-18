<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-12">
        <h1 class="text-center mb-4">Admin Page</h1>

        <!-- PrimeVue DataTable with filtering functionality -->
        <DataTable v-model:selection="selectedEmails" :value="filteredUsers" dataKey="email" paginator :rows="5" selectionMode="multiple" class="p-datatable-gridlines">
          <template #header>
            <div class="table-header d-flex justify-content-between align-items-center">
              <h5 class="mx-0 my-1">Select users to send email</h5>
              <span class="p-input-icon-left search-input">
                <i class="pi pi-search"></i>
                <InputText v-model="filter" placeholder="Search by username, email, role, or resident status" />
              </span>
            </div>
          </template>
          <Column selectionMode="multiple" headerStyle="width: 3em"></Column>
          <Column field="username" header="Username" sortable></Column>
          <Column field="email" header="Email" sortable></Column>
          <Column field="role" header="Role" sortable></Column>
          <Column field="isAustralianResident" header="Australian Resident" :body="residenceLabel" sortable></Column>
        </DataTable>

        <form @submit.prevent="submitForm" class="p-4 border rounded shadow mt-4">
          <div class="mb-3">
            <label for="from" class="form-label">From Email</label>
            <input type="email" class="form-control" id="from" v-model="fromEmail" required />
          </div>

          <div class="mb-3">
            <label for="subject" class="form-label">Subject</label>
            <input type="text" class="form-control" id="subject" v-model="subject" required />
          </div>

          <div class="mb-3">
            <label for="attachments" class="form-label">Attachments</label>
            <input type="file" class="form-control" id="attachments" @change="handleFileUpload" multiple />
          </div>

          <div class="text-center">
            <button type="submit" class="btn btn-primary btn-lg w-100 mb-3">Send Email</button>
          </div>
        </form>

        <div v-if="responseMessage" class="alert alert-success mt-3 text-center">{{ responseMessage }}</div>
        <div v-if="errorMessage" class="alert alert-danger mt-3 text-center">{{ errorMessage }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getFirestore, collection, getDocs } from 'firebase/firestore'
import axios from 'axios'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'

const db = getFirestore()

const users = ref([]) 
const selectedEmails = ref([]) 
const fromEmail = ref('') 
const subject = ref('') 
const filter = ref('') 
const attachments = ref([]) 
const responseMessage = ref(null) 
const errorMessage = ref(null) 

// Function to format the resident status for display
const residenceLabel = (user) => {
  return user.isAustralianResident === 'yes' ? 'Yes' : 'No';
};

// Fetch and filter users with PrimeVue filtering
const filteredUsers = computed(() => {
  if (!filter.value) {
    return users.value
  }
  const searchTerm = filter.value.toLowerCase()
  return users.value.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm) ||
      user.role.toLowerCase().includes(searchTerm) ||
      (user.isAustralianResident === 'yes' ? 'yes' : 'no').includes(searchTerm)
  )
})

const fetchUsers = async () => {
  const querySnapshot = await getDocs(collection(db, 'users'))
  querySnapshot.forEach((doc) => {
    users.value.push({ ...doc.data() }) 
  })
}

const handleFileUpload = (event) => {
  attachments.value = [] 
  const files = event.target.files
  for (let i = 0; i < files.length; i++) {
    const reader = new FileReader()
    reader.onload = (e) => {
      attachments.value.push({
        "Content-type": files[i].type,
        Filename: files[i].name,
        content: btoa(e.target.result) 
      })
    }
    reader.readAsArrayBuffer(files[i]) 
  }
}

const submitForm = async () => {
  if (selectedEmails.value.length === 0) {
    errorMessage.value = 'Please select at least one recipient.'
    return
  }

  try {
    responseMessage.value = null
    errorMessage.value = null

    const params = {
      from: fromEmail.value,
      to: selectedEmails.value.join(','), 
      subject: subject.value,
      attachments: JSON.stringify(attachments.value) 
    }

    await axios.get('https://sendemail-23kcp2q4ca-uc.a.run.app', { params })

    responseMessage.value = 'Email sent successfully!'
  } catch (error) {
    errorMessage.value = `Error: ${error.response ? error.response.data : error.message}`
  }
}

onMounted(fetchUsers)
</script>

<style scoped>
.container {
  max-width: 80vw;
  margin: 0 auto;
  padding: 20px;
  border-radius: 10px;
}

h1 {
  font-size: 2rem;
  color: #333;
}

input {
  margin-bottom: 10px;
}

button {
  font-size: 1.2rem;
}

.alert {
  font-size: 1rem;
}

.shadow {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.p-input-icon-left {
  margin-left: 20px;
  width: 380px; /* Adjust the width of the search input */
}

.search-input input {
  width: 100%; /* Make sure the input fills the container */
}
</style>