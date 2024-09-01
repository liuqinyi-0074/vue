<script setup>
import { ref, onMounted } from 'vue'

const questions = ref([
  'Q1: Rate your overall user experience',
  'Q2: Rate the ease of navigation',
  'Q3: Rate the visual design',
  'Q4: Rate the loading speed of the website',
  'Q5: Rate the quality of the content'
])

const ratings = ref(Array(questions.value.length).fill(0))
const feedbackText = ref('')
const feedbackHistory = ref([])
const averageRatings = ref(Array(questions.value.length).fill(0))
const showAggregatedRating = ref(false)

onMounted(() => {
  const storedFeedback = localStorage.getItem('feedbackHistory')
  if (storedFeedback) {
    feedbackHistory.value = JSON.parse(storedFeedback)
  }
})

const submitFeedback = () => {
  const newFeedback = {
    ratings: [...ratings.value],
    feedbackText: feedbackText.value,
    timestamp: new Date().toISOString()
  }
  feedbackHistory.value.push(newFeedback)
  localStorage.setItem('feedbackHistory', JSON.stringify(feedbackHistory.value))

  alert('Thank you for your feedback!')

  ratings.value = Array(questions.value.length).fill(0)
  feedbackText.value = ''
}

const calculateAverageRatings = () => {
  const totalRatings = Array(questions.value.length).fill(0)
  const counts = Array(questions.value.length).fill(0)

  feedbackHistory.value.forEach((entry) => {
    entry.ratings.forEach((rating, index) => {
      totalRatings[index] += rating
      counts[index] += 1
    })
  })

  averageRatings.value = totalRatings.map((total, index) =>
    counts[index] > 0 ? total / counts[index] : 0
  )
  showAggregatedRating.value = true
}
</script>
<template>
  <div class="container mt-5">
    <h1 class="text-center">Feedback Page</h1>
    <p class="text-center">Please rate your experience:</p>

    <form @submit.prevent="submitFeedback">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="mb-3" v-for="(question, index) in questions" :key="index">
            <label :for="'question' + index" class="form-label">{{ question }}</label>
            <input
              type="number"
              class="form-control"
              :id="'question' + index"
              v-model.number="ratings[index]"
              min="1"
              max="5"
              placeholder="Enter a score between 1 and 5"
              required
            />
          </div>
          <div class="mb-3">
            <label for="feedbackText" class="form-label">Additional Feedback</label>
            <textarea
              class="form-control"
              id="feedbackText"
              v-model="feedbackText"
              rows="4"
              placeholder="Enter your feedback here"
            ></textarea>
          </div>
          <div class="text-center">
            <button type="submit" class="btn btn-primary">Submit Feedback</button>
          </div>
        </div>
      </div>
    </form>

    <div class="text-center mt-5">
      <button class="btn btn-secondary" @click="calculateAverageRatings">
        View Aggregated Rating
      </button>
    </div>

    <div v-if="showAggregatedRating" class="mt-5">
      <h4 class="text-center">Aggregated Rating Score</h4>
      <ul class="list-group">
        <li v-for="(avg, index) in averageRatings" :key="index" class="list-group-item">
          {{ questions[index] }}: {{ avg.toFixed(1) }} out of 5
        </li>
      </ul>
    </div>
  </div>
</template>



<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.form-label {
  font-weight: bold;
}

input[type='number'] {
  width: 100px;
}

textarea {
  resize: none;
}

.list-group-item {
  font-size: 1.1rem;
}
</style>
