<template>
    <h1>Create an Account</h1>
    <p><input type="text" placeholder="Email" v-model = "email"/></p>
    <p><input type="password" placeholder="Password" v-model="password" /></p>
    <p><button type="button" class="btn btn-primary me-2" @click="register">Save to Firebase</button></p>
</template>

<script setup>
import { ref } from"vue"
import {getAuth, createUserWithEmailAndPassword} from "firebase/auth"
import{useRouter} from"vue-router"
const email = ref("")
const password = ref("")
const router =useRouter()
const auth= getAuth()
const register=()=>{
    createUserWithEmailAndPassword(auth, email.value, password.value)
    .then((data) => {
        console.log("Firebase Register Successful!")
        console.log(data)
        alert("Congratulation!")
        router.push("/FireLogin")
    }).catch((error)=>{
        console.log("Register failed")
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("register error code", errorCode)
        console.log("register error message", errorMessage)
        alert("Registration failed: " + errorMessage)
    })
};
</script>