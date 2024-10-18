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
import axios from 'axios'

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

// Validation functions (same as before)
const validateName = (blur) => {
  if (formData.value.username.length < 3) {
    errors.value.username = blur ? 'Name must be at least 3 characters long' : null
  } else {
    errors.value.username = null
  }
}

const validateEmail = (blur) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailPattern.test(formData.value.email)) {
    errors.value.email = blur ? 'Invalid email format' : null
  } else {
    errors.value.email = null
  }
}

const validatePassword = (blur) => {
  const password = formData.value.password
  const minLength = 8
  if (password.length < minLength) {
    errors.value.password = blur ? `Password must be at least ${minLength} characters long.` : null
  } else {
    errors.value.password = null
  }
}

const validateConfirmPassword = (blur) => {
  if (formData.value.password !== formData.value.confirmPassword) {
    errors.value.confirmPassword = blur ? 'Passwords do not match' : null
  } else {
    errors.value.confirmPassword = null
  }
}

// Send welcome email function (same as before)
const sendWelcomeEmail = async (email) => {
  try {
    const response = await axios.get('https://sendemail-23kcp2q4ca-uc.a.run.app', {
      params: {
        from: 'liuqinyi1927@gmail.com',
        to: email,
        subject: 'Welcome to Social Food Website',
      },
    });
    console.log('Welcome email sent successfully:', response.data);
  } catch (error) {
    console.error('Failed to send welcome email:', error);
  }
}

const submitForm = async () => {
  validateName(true)
  validateEmail(true)
  validatePassword(true)
  validateConfirmPassword(true)

  if (errors.value.username || errors.value.email || errors.value.password || errors.value.confirmPassword) {
    return
  }

  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, formData.value.email, formData.value.password)
    const user = userCredential.user
    userId.value = user.uid  // Store user ID for role update

    // Store user data with initial role as 'user' and residency status in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      username: formData.value.username,
      email: formData.value.email,
      role: 'user',
      isAustralianResident: formData.value.isAustralianResident
    })

    successMessage.value = 'Sign up successful!'

    // Clear form after successful registration
    const userEmail = formData.value.email
    formData.value = {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      isAustralianResident: 'no'
    }

    // Send welcome email
    await sendWelcomeEmail(userEmail)

    // Show admin registration prompt
    showAdminPrompt.value = true
  } catch (error) {
    console.error('Error during registration:', error)
  }
}

// Function to set the role and update in Firestore
const setRole = async (role) => {
  if (userId.value) {
    try {
      await setDoc(doc(db, 'users', userId.value), { role }, { merge: true })
      successMessage.value = `You are now registered as a ${role}!`
    } catch (error) {
      console.error('Error updating role:', error)
    }
  }
  showAdminPrompt.value = false  // Hide the admin prompt modal
  setTimeout(() => {
    router.push('/FirebaseSigninView')
  }, 2000)
}
</script>

<style scoped>
/* Same styles as before */
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