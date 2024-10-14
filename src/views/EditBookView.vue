<script>
import { ref, onMounted } from 'vue'
import db from '../firebase/init.js'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { useRoute } from 'vue-router'

export default {
  setup() {
    const isbn = ref('')
    const name = ref('')
    const bookid = useRoute().params.bookid
    console.log('edit book: ' + bookid)
    const getBook = async () => {
      try {
        // Replace with your actual collection name and document ID
        const docRef = doc(db, 'books', bookid) // Specify the correct collection and document ID
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          console.log('Document data: ', docSnap.data())
          isbn.value = docSnap.data().isbn
          name.value = docSnap.data().name
        } else {
          console.log('No such document!')
        }
      } catch (error) {
        console.error('Error getting book:', error)
      }
    }

    const editBook = async () => {
      try {
        const isbnNumber = Number(isbn.value) // Convert to number once
        if (isNaN(isbnNumber)) {
          alert('ISBN must be a valid number')
          return
        }

        // Replace with your actual collection name and document ID for the city
        const cityRef = doc(db, 'cities', bookid) // Specify the correct collection and document ID
        await setDoc(cityRef, { capital: true }, { merge: true })

        // Update the book document
        await setDoc(doc(db, 'books', bookid), {
          // Specify the correct collection and document ID
          isbn: isbnNumber,
          name: name.value
        })

        alert('Book updated successfully!') // Optionally notify the user
      } catch (error) {
        console.error('Error editing book:', error)
      }
    }

    onMounted(() => {
      getBook()
    })

    return {
      isbn,
      name,
      editBook
    }
  }
}
</script>
<template>
  <div>
    <h1>Edit Book</h1>
    <form @submit.prevent="editBook">
      <div>
        <label for="isbn">ISBN:</label>
        <input type="text" v-model="isbn" id="isbn" required />
      </div>
      <div>
        <label for="name">Name:</label>
        <input type="text" v-model="name" id="name" required />
      </div>
      <button type="submit">Edit Book</button>
    </form>
  </div>
</template>
