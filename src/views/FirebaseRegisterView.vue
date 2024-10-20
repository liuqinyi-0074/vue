<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <h1 class="text-center mb-4">Social Food Web Sign Up</h1>
        <form @submit.prevent="submitForm" class="p-4 border rounded shadow">
          <!-- Username Field -->
          <div class="mb-3">
            <label for="username" class="form-label">Username</label>
            <input
              type="text"
              class="form-control"
              id="username"
              v-model="formData.username"
              @blur="validateName(true)"
              @input="validateName(false)"
            />
            <div v-if="errors.username" class="text-danger">{{ errors.username }}</div>
          </div>

          <!-- Email Field -->
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input
              type="email"
              class="form-control"
              id="email"
              v-model="formData.email"
              @blur="validateEmail(true)"
              @input="validateEmail(false)"
            />
            <div v-if="errors.email" class="text-danger">{{ errors.email }}</div>
          </div>

          <!-- Password Field -->
          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input
              type="password"
              class="form-control"
              id="password"
              v-model="formData.password"
              @blur="validatePassword(true)"
              @input="validatePassword(false)"
            />
            <div v-if="errors.password" class="text-danger">{{ errors.password }}</div>
          </div>

          <!-- Confirm Password Field -->
          <div class="mb-3">
            <label for="confirmPassword" class="form-label">Confirm Password</label>
            <input
              type="password"
              class="form-control"
              id="confirmPassword"
              v-model="formData.confirmPassword"
              @blur="validateConfirmPassword(true)"
              @input="validateConfirmPassword(false)"
            />
            <div v-if="errors.confirmPassword" class="text-danger">
              {{ errors.confirmPassword }}
            </div>
          </div>

          <!-- Australian Resident Field -->
          <div class="mb-3">
            <label for="australianResident" class="form-label">Are you an Australian resident?</label>
            <select v-model="formData.isAustralianResident" class="form-control" id="australianResident">
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

          <div class="text-center">
            <button type="submit" class="btn btn-primary btn-lg w-100 mb-3">Submit</button>
          </div>
        </form>

        <!-- Success Message -->
        <div v-if="successMessage" class="alert alert-success mt-3 text-center">
          {{ successMessage }}
        </div>
      </div>
    </div>
  </div>

  <!-- Modal for Admin Registration -->
  <div v-if="showAdminPrompt" class="modal d-block" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Register as Admin</h5>
        </div>
        <div class="modal-body">
          <p>Would you like to register as an Admin?</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" @click="setRole('admin')">Yes, Register as Admin</button>
          <button type="button" class="btn btn-secondary" @click="setRole('user')">No, Register as User</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { getFirestore, doc, setDoc } from 'firebase/firestore'

// Initialize Firestore
const db = getFirestore()

const formData = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  isAustralianResident: 'no'  // Default to 'no'
})

const errors = ref({
  username: null,
  email: null,
  password: null,
  confirmPassword: null,
})

const successMessage = ref('')
const showAdminPrompt = ref(false) // To show admin registration prompt
const userId = ref(null)  // To store user ID for later role update

const router = useRouter()
const auth = getAuth()

// Validation functions
const validateName = (blur) => {
  errors.value.username = formData.value.username.length < 3 && blur ? 'Name must be at least 3 characters long' : null
}

const validateEmail = (blur) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  errors.value.email = !emailPattern.test(formData.value.email) && blur ? 'Invalid email format' : null
}

const validatePassword = (blur) => {
  errors.value.password = formData.value.password.length < 8 && blur ? 'Password must be at least 8 characters long' : null
}

const validateConfirmPassword = (blur) => {
  errors.value.confirmPassword = formData.value.password !== formData.value.confirmPassword && blur ? 'Passwords do not match' : null
}

const submitForm = async () => {
  validateName(true)
  validateEmail(true)
  validatePassword(true)
  validateConfirmPassword(true)

  if (Object.values(errors.value).some(error => error)) return

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, formData.value.email, formData.value.password)
    userId.value = userCredential.user.uid

    await setDoc(doc(db, 'users', userId.value), {
      username: formData.value.username,
      email: formData.value.email,
      role: 'user',
      isAustralianResident: formData.value.isAustralianResident
    })

    successMessage.value = 'Sign up successful!'

    formData.value = { username: '', email: '', password: '', confirmPassword: '', isAustralianResident: 'no' }

    showAdminPrompt.value = true
  } catch (error) {
    console.error('Error during registration:', error)
  }
}

const setRole = async (role) => {
  if (!userId.value) return
  try {
    await setDoc(doc(db, 'users', userId.value), { role }, { merge: true })
    successMessage.value = `You are now registered as a ${role}!`
    showAdminPrompt.value = false
    setTimeout(() => router.push('/FirebaseSigninView'), 2000)
  } catch (error) {
    console.error('Error updating role:', error)
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
}

h1 {
  font-size: 2rem;
  color: #333;
}

input, textarea, select {
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

.modal {
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.modal-dialog {
  max-width: 500px;
}

.modal-content {
  padding: 20px;
}
</style>