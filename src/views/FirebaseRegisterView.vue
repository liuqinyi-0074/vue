<template>
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <h1 class="text-center mb-4">Social Food Web Sign Up</h1>
          <form @submit.prevent="submitForm" class="p-4 border rounded shadow">
            <div class="mb-3">
              <label for="username" class="form-label">Username</label>
              <input
                type="text"
                class="form-control"
                id="username"
                @blur="() => validateName(true)"
                @input="() => validateName(false)"
                v-model="formData.username"
              />
              <div v-if="errors.username" class="text-danger">{{ errors.username }}</div>
            </div>
  
            <div class="mb-3">
              <label for="gender" class="form-label">Gender</label>
              <select class="form-select" id="gender" v-model="formData.gender" required>
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
  
            <div class="mb-3">
              <label for="password" class="form-label">Password</label>
              <input
                type="password"
                class="form-control"
                id="password"
                @blur="() => validatePassword(true)"
                @input="() => validatePassword(false)"
                v-model="formData.password"
              />
              <div v-if="errors.password" class="text-danger">{{ errors.password }}</div>
            </div>
  
            <div class="mb-3">
              <label for="confirm-password" class="form-label">Confirm password</label>
              <input
                type="password"
                class="form-control"
                id="confirm-password"
                @blur="() => validateConfirmPassword(true)"
                @input="() => validateConfirmPassword(false)"
                v-model="formData.confirmPassword"
              />
              <div v-if="errors.confirmPassword" class="text-danger">
                {{ errors.confirmPassword }}
              </div>
            </div>
  
            <div class="form-check mb-3">
              <input
                type="checkbox"
                class="form-check-input"
                id="isAustralian"
                v-model="formData.isAustralian"
              />
              <label class="form-check-label" for="isAustralian">Australian Resident?</label>
            </div>
  
            <div class="mb-3">
              <label for="reason" class="form-label">Reason for joining</label>
              <textarea
                class="form-control"
                id="reason"
                rows="3"
                v-model="formData.reason"
                @blur="() => validateReason(true)"
                @input="() => {
                  validateReason(false)
                  validateReasonComment(true)
                }"
              ></textarea>
              <div v-if="errors.reason" class="text-danger">{{ errors.reason }}</div>
              <div v-if="reasonHasFriend" class="text-success">Great to have a friend!</div>
            </div>
  
            <div class="mb-3">
              <label for="suburb" class="form-label">Suburb</label>
              <input type="text" class="form-control" id="suburb" v-bind:value="formData.suburb" />
            </div>
  
            <div class="text-center">
              <button type="submit" class="btn btn-primary btn-lg w-100 mb-3">Submit</button>
              <button type="button" class="btn btn-secondary w-100" @click="clearForm">Clear</button>
            </div>
          </form>
  
          <div v-if="successMessage" class="alert alert-success mt-3 text-center">
            {{ successMessage }}
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
  import { getFirestore, doc, setDoc } from 'firebase/firestore'
  import { useRouter } from 'vue-router'
  
  
  const formData = ref({
    username: '',
    password: '',
    confirmPassword: '',
    isAustralian: false,
    reason: '',
    gender: '',
    suburb: 'Clayton'
  })
  
  const submittedCards = ref([])
  const successMessage = ref('')
  const router = useRouter()
  const auth = getAuth()
  const db = getFirestore()
  
  onMounted(() => {
    const storedCards = localStorage.getItem('submittedCards')
    if (storedCards) {
      submittedCards.value = JSON.parse(storedCards)
    }
  })
  
  
  const submitForm = () => {
    validateName(true)
    validatePassword(true)
    validateConfirmPassword(true)
    validateReason(true)
  
    const usernameExists = submittedCards.value.some(
      (user) => user.username === formData.value.username
    )
    if (usernameExists) {
      alert('The username is not available')
      return
    }
  
    
    if (
      !errors.value.username &&
      !errors.value.password &&
      !errors.value.confirmPassword &&
      !errors.value.reason
    ) {
      
      const isAdmin = window.confirm('Would you like to register as an admin?')
  
      createUserWithEmailAndPassword(auth, formData.value.username, formData.value.password)
        .then(async (data) => {
  
          await setDoc(doc(db, 'users', data.user.uid), {
            username: formData.value.username,
            email: formData.value.username,
            gender: formData.value.gender,
            suburb: formData.value.suburb,
            isAustralian: formData.value.isAustralian,
            reason: formData.value.reason,
            role: isAdmin ? 'admin' : 'user' 
          })
  
          submittedCards.value.push({ ...formData.value })
          localStorage.setItem('submittedCards', JSON.stringify(submittedCards.value))
          clearForm()
          successMessage.value = 'Sign up successful!'
          setTimeout(() => {
            successMessage.value = ''
            router.push('/FireLogin')
          }, 1000)
        })
        .catch((error) => {
          console.log('Register failed', error)
          alert('Registration failed: ' + error.message)
        })
    }
  }
  
  
  const clearForm = () => {
    formData.value = {
      username: '',
      password: '',
      confirmPassword: '',
      isAustralian: false,
      reason: '',
      gender: '',
      suburb: 'Clayton'
    }
  }
  
  const errors = ref({
    username: null,
    password: null,
    confirmPassword: null,
    reason: null
  })
  
 
  const validateName = (blur) => {
    if (formData.value.username.length < 3) {
      if (blur) errors.value.username = 'Name must be at least 3 characters'
    } else {
      errors.value.username = null
    }
  }
  
  const validatePassword = (blur) => {
    const password = formData.value.password
    const minLength = 8
    const hasUppercase = /[A-Z]/.test(password)
    const hasLowercase = /[a-z]/.test(password)
    const hasNumber = /\d/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)
  
    if (password.length < minLength) {
      if (blur) errors.value.password = `Password must be at least ${minLength} characters long.`
    } else if (!hasUppercase) {
      if (blur) errors.value.password = 'Password must contain at least one uppercase letter.'
    } else if (!hasLowercase) {
      if (blur) errors.value.password = 'Password must contain at least one lowercase letter.'
    } else if (!hasNumber) {
      if (blur) errors.value.password = 'Password must contain at least one number.'
    } else if (!hasSpecialChar) {
      if (blur) errors.value.password = 'Password must contain at least one special character.'
    } else {
      errors.value.password = null
    }
  }
  
  const validateConfirmPassword = (blur) => {
    if (formData.value.password !== formData.value.confirmPassword) {
      if (blur) errors.value.confirmPassword = 'Passwords do not match.'
    } else {
      errors.value.confirmPassword = null
    }
  }
  
  const validateReason = (blur) => {
    if (formData.value.reason.length < 5) {
      if (blur) errors.value.reason = 'Reason must be at least 5 characters'
    } else {
      errors.value.reason = null
    }
  }
  
  const reasonHasFriend = ref(false)
  const validateReasonComment = (blur) => {
    if (formData.value.reason.includes('friend')) {
      if (blur) reasonHasFriend.value = true
    } else {
      reasonHasFriend.value = false
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
  
  .form {
    text-align: center;
    margin-top: 50px;
  }
  
  input, textarea, select {
    margin-bottom: 10px;
  }
  
  button {
    font-size: 1.2rem;
  }
  
  textarea {
    resize: none;
  }
  
  .alert {
    font-size: 1rem;
  }
  
  .shadow {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  </style>