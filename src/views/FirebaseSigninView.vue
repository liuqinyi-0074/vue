<template>
    <h1>sign in</h1>
    <p><input type="text" placeholder="Email" v-model = "email"/></p>
    <p><input type="password" placeholder="Password" v-model="password" /></p>
    <p><button type="button" class="btn btn-primary me-2" @click="fireSignin">Sign in to Firebase</button></p>
</template>

<script setup>
import {ref } from "vue"
import {getAuth, signInWithEmailAndPassword} from "firebase/auth"
import{useRouter} from"vue-router"
const email = ref("")
const password = ref("")
const router =useRouter()
const auth= getAuth()

const adminEmail = 'admin1234@gmail.com'
const fireSignin=()=>{
    signInWithEmailAndPassword(auth, email.value, password.value)
    .then((data) => {
        if(data.user.email == adminEmail)
    {
        alert("Admin login")
        router.push('/Login')
    }else{
        alert("Login success")
        router.push('/')
    }
        console.log("Firebase Sign in Successful!")
        console.log(data)
        alert("Congratulation!")
        router.push("/")
    }).catch((error)=>{
        console.log("Sign in failed")
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("sign in error code", errorCode)
        console.log("sign in error message", errorMessage)
        alert("Sign in failed: " + errorMessage)
    })
};
</script>