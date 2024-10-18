<template>
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <h1 class="text-center mb-4">Login Page</h1>
  
    
          <form @submit.prevent="fireSignin" class="p-4 border rounded shadow">
            <div class="mb-3">
              <label for="username" class="form-label">Email</label>
              <input
                type="text"
                class="form-control"
                id="username"
                v-model="formData.username"
              />
              <div v-if="errors.username" class="text-danger">{{ errors.username }}</div>
            </div>
  
            <div class="mb-3">
              <label for="password" class="form-label">Password</label>
              <input
                type="password"
                class="form-control"
                id="password"
                v-model="formData.password"
              />
              <div v-if="errors.password" class="text-danger">{{ errors.password }}</div>
            </div>
  
            <div class="text-center">
              <button type="submit" class="btn btn-primary btn-lg w-100 mb-3">Login with Firebase</button>
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
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
  import { getFirestore, doc, getDoc } from 'firebase/firestore'
  
  const router = useRouter()
  const auth = getAuth()
  const db = getFirestore()
  
  const formData = ref({
    username: '',
    password: ''
  })
  
  const errors = ref({
    username: null,
    password: null
  })
  
  const fireSignin = async () => {
    try {
      const { user } = await signInWithEmailAndPassword(auth, formData.value.username, formData.value.password)
      console.log('Firebase Sign in Successful!')
  
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      if (userDoc.exists()) {
        const userData = userDoc.data()
        const userRole = userData.role
  
        if (userRole === 'admin') {
          alert('Admin login')
          router.push({ name: 'AdminDashboard' })
        } else {
          alert('Login success as user')
          router.push({ name: 'HomePage' })
        }
      } else {
        alert('No role found for user')
      }
    } catch (error) {
      console.error('Sign in failed', error)
      errors.value.username = 'Sign in failed'
      errors.value.password = 'Sign in failed'
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
  
  input, select {
    width: 100%;
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
  </style>