
<template>
  <div>
    <h1>Home Page</h1>
    <p>Welcome to the home page!</p>
  </div>
</template>

<script setup>
import {getAuth} from "firebase/auth";
console.log("home auth", getAuth())
console.log("home auth current user: ", getAuth().currentUser)
</script>

<style scoped></style>
