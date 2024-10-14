<script setup>
import { getAuth, signOut } from 'firebase/auth'

import { Alert } from 'bootstrap'

const auth = getAuth()
const firebaseLogout = () => {
  signOut(auth)
    .then(() => {
      Alert('Sign out Success')
    })
    .catch((error) => {
      console.log('Logout error', error)
      Alert('Sign out failed')
    })
}
</script>
<template>

  <div class="container">
    <header class="d-flex justify-content-center py-3">
      <ul class="nav nav-pills">
        <li class="nav-item">
          <router-link
            to="/SignUpPage"
            class="nav-link"
            active-class="active"
            aria-current="Sign up page"
            >Sign up Page</router-link
          >
        </li>
        <li class="nav-item">
          <router-link to="/HomePage" class="nav-link" active-class="active">Home Page</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/LoginPage" class="nav-link" active-class="active"
            >Login page</router-link
          >
        </li>
        <li class="nav-item">
          <router-link to="/FeedbackPage" class="nav-link" active-class="active"
            >Feedback Page</router-link
          >
        </li>
        <li class="nav-item">
          <router-link to="/FirebaseRegister" class="nav-link" active-class="active"
            >Firebase Login</router-link
          >
        </li>
        <li class="nav-item">
          <router-link to="/FirebaseSigninView" class="nav-link" active-class="active"
            >Firebase Register</router-link
          >
        </li>
        <li class="nav-item">
          <router-link to="/addbook" class="nav-link" active-class="active">Add Book</router-link>
        </li>
        <li class="nav-item">
          <button class="nav-link" @click="firebaseLogout">Firebase Logout</button>
        </li>
        <li class="nav-item">
          <router-link to="/BookListView" class="nav-link" active-class="active"
            >Book List</router-link
          >
        </li>
        <li class="nav-item">
          <router-link to="/GetBookCountView" class="nav-link" active-class="active"
            >Book Count</router-link
          >
        </li>
        <li class="nav-item">
          <router-link to="/WeatherView" class="nav-link" active-class="active"
            >Weather View</router-link
          >
        </li>
      </ul>
    </header>
  </div>
</template>

<style scoped>
.b-example-divider {
  height: 3rem;
  background-color: rgba(0, 0, 0, 0.1);
  border: solid rgba(0, 0, 0, 0.15);
  border-width: 1px 0;
  box-shadow:
    inset 0 0.5em 1.5em rgba(0, 0, 0, 0.1),
    inset 0 0.125em 0.5em rgba(0, 0, 0, 0.15);
}

.form-control-dark {
  color: #fff;
  background-color: var(--bs-dark);
  border-color: var(--bs-gray);
}
.form-control-dark:focus {
  color: #fff;
  background-color: var(--bs-dark);
  border-color: #fff;
  box-shadow: 0 0 0 0.25rem rgba(255, 255, 255, 0.25);
}

.bi {
  vertical-align: -0.125em;
  fill: currentColor;
}

.text-small {
  font-size: 85%;
}

.dropdown-toggle {
  outline: 0;
}
</style>
