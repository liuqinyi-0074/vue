<template>
  <div class="container mt-5">
    <h1 class="text-center">Charity Overview</h1>
    <p class="text-center">List of charities supported by the organization.</p>

    <!-- Simple Input Fields for Debugging -->
    <div class="mb-3">
      <label for="nameFilter">Filter by Name:</label>
      <input v-model="filters.name" id="nameFilter" type="text" placeholder="Search by name" />
    </div>

    <div class="mb-3">
      <label for="locationFilter">Filter by Location:</label>
      <input v-model="filters.location" id="locationFilter" type="text" placeholder="Search by location" />
    </div>

    <div class="mb-3">
      <label for="typeFilter">Filter by Type:</label>
      <select v-model="filters.type" id="typeFilter" multiple>
        <option value="Healthcare">Healthcare</option>
        <option value="Food Assistance">Food Assistance</option>
        <option value="Mental Health">Mental Health</option>
        <option value="Housing Support">Housing Support</option>
      </select>
    </div>

    <!-- Basic Table for Debugging -->
    <table class="table table-striped table-hover table-bordered">
      <thead>
        <tr>
          <th>Charity Name</th>
          <th>Location</th>
          <th>Type</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="charity in paginatedCharities" :key="charity.id">
          <td>{{ charity.name }}</td>
          <td>{{ charity.location }}</td>
          <td>{{ charity.type }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination Controls -->
    <div class="d-flex justify-content-between align-items-center mt-3">
      <button @click="prevPage" :disabled="currentPage === 1" class="btn btn-outline-primary">Previous</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages" class="btn btn-outline-primary">Next</button>
    </div>

    <!-- Clear Filters Button -->
    <button @click="clearFilter" class="btn btn-outline-danger mt-3">Clear Filters</button>

    <!-- OpenAI Section -->
    <div class="mt-4">
      <button @click="fetchOpenAIResponse" class="btn btn-success mb-3">Get OpenAI Response</button>
      <div v-if="openAIResponse">
        <h5>OpenAI Response:</h5>
        <p>{{ openAIResponse }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { GoogleGenerativeAI } from "@google/generative-ai"

// Sample charity data
const charities = ref([
  { id: 1, name: 'Health for All', location: 'New York, USA', type: 'Healthcare' },
  { id: 2, name: 'FoodAid International', location: 'London, UK', type: 'Food Assistance' },
  { id: 3, name: 'Mental Health Outreach', location: 'Sydney, Australia', type: 'Mental Health' },
  { id: 4, name: 'Housing for Hope', location: 'Toronto, Canada', type: 'Housing Support' },
]);

// Filters for the DataTable
const filters = ref({
  name: '',      // Default to empty string for name search
  location: '',  // Default to empty string for location search
  type: []       // Default to an empty array for type selection
});

// Pagination variables
const currentPage = ref(1);
const rowsPerPage = ref(10); // Display 10 rows per page

// Computed property to filter the charities based on user input
const filteredCharities = computed(() => {
  return charities.value.filter(charity => {
    const nameMatch = charity.name.toLowerCase().includes(filters.value.name.toLowerCase());
    const locationMatch = charity.location.toLowerCase().includes(filters.value.location.toLowerCase());
    const typeMatch = filters.value.type.length === 0 || filters.value.type.includes(charity.type);
    return nameMatch && locationMatch && typeMatch;
  });
});

// Total pages calculation
const totalPages = computed(() => Math.ceil(filteredCharities.value.length / rowsPerPage.value));

// Paginated charities based on current page and rows per page
const paginatedCharities = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage.value;
  const end = start + rowsPerPage.value;
  return filteredCharities.value.slice(start, end);
});

// Clear filters function
const clearFilter = () => {
  filters.value = {
    name: '',
    location: '',
    type: []
  };
};

// Pagination control functions
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

// OpenAI API response state
const openAIResponse = ref('')

// Function to fetch content from Google Generative AI
const fetchOpenAIResponse = async () => {
  try {
    const apiKey = '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'; // Ensure this is set in .env file

    // Initialize Google Generative AI
    const genAI = new GoogleGenerativeAI(apiKey);

    // Get the model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Generate content
    const result = await model.generateContent(["Explain how AI works"]);

    // Set the response
    openAIResponse.value = result.responses[0].text;
  } catch (error) {
    console.error('Error fetching AI content:', error);
    openAIResponse.value = 'Failed to fetch AI content.';
  }
}
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

.table-bordered {
  border: 2px solid #dee2e6;
}

.table-striped tbody tr:nth-of-type(odd) {
  background-color: #f2f2f2;
}

.table-hover tbody tr:hover {
  background-color: #dfe6e9;
}
</style>