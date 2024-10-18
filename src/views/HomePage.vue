<template>
  <div class="container mt-5">
    <h1 class="text-center">Charity Overview</h1>
    <p class="text-center">List of charities supported by the organization.</p>

    <div class="datatable-container mt-5">
      <div class="table-header mb-3 d-flex justify-content-between align-items-center">
        <Button label="Clear Filters" icon="pi pi-filter-slash" class="btn btn-outline-danger" @click="clearFilter" />
      </div>


      <DataTable :value="charities" paginator :rows="10" dataKey="id" filterDisplay="row" 
        :rowsPerPageOptions="[10, 20, 50]" :filters="filters" tableStyle="min-width: 50rem" class="table-striped table-hover table-bordered">
        

        <Column field="name" header="Charity Name" style="min-width: 12rem">
          <template #body="{ data }">{{ data.name }}</template>
          <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" @input="filterCallback()" placeholder="Search by name" class="form-control" />
          </template>
        </Column>

        <Column field="location" header="Location" style="min-width: 12rem">
          <template #body="{ data }">{{ data.location }}</template>
          <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" @input="filterCallback()" placeholder="Search by location" class="form-control" />
          </template>
        </Column>

        <Column field="type" header="Type of Charity" style="min-width: 12rem">
          <template #body="{ data }">{{ data.type }}</template>
          <template #filter="{ filterModel, filterCallback }">
            <MultiSelect v-model="filterModel.value" @change="filterCallback()" :options="types" optionLabel="label" placeholder="Select Type" class="form-control" />
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import MultiSelect from 'primevue/multiselect'
import Button from 'primevue/button'


const charities = ref([
  { id: 1, name: 'Health for All', location: 'New York, USA', type: 'Healthcare' },
  { id: 2, name: 'FoodAid International', location: 'London, UK', type: 'Food Assistance' },
  { id: 3, name: 'Mental Health Outreach', location: 'Sydney, Australia', type: 'Mental Health' },
  { id: 4, name: 'Housing for Hope', location: 'Toronto, Canada', type: 'Housing Support' },

])


const filters = ref({
  name: { value: null },
  location: { value: null },
  type: { value: null }
})


const clearFilter = () => {
  filters.value = {
    name: { value: null },
    location: { value: null },
    type: { value: null }
  }
}


const types = ref([
  { label: 'Healthcare', value: 'Healthcare' },
  { label: 'Food Assistance', value: 'Food Assistance' },
  { label: 'Mental Health', value: 'Mental Health' },
  { label: 'Housing Support', value: 'Housing Support' },

])
</script>

<style scoped>
.container {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  max-width: 80vw;
  margin: 0 auto;
  padding: 20px;
  border-radius: 10px;
  background-color: #f8f9fa;
}

.table-header {
  margin-bottom: 1rem;
}

.table-bordered {
  border: 2px solid #dee2e6;
}

.table-striped tbody tr:nth-of-type(odd) {
  background-color: #f2f2f2;
}

.table-hover tbody tr:hover {
  background-color: #dfe6e9;
}

.input-group-text {
  background-color: #007bff;
  color: #fff;
}

.p-input-icon-left i {
  margin-right: 0.5rem;
}
</style>