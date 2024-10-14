<template>
    <div>
        <h1>Add Book</h1>
        <form @submit.prevent="addBook">
            <div>
                <label for="isbn">ISBN:</label>
                <input type="text" v-model="isbn" id="isbn" required />
            </div>
            <div>
                <label for="name">Name:</label>
                <input type="text" v-model="name" id="name" required />
            </div>
            <button type="submit">Add Book</button>
            <p v-if="error" class="error">{{ error }}</p> 
        </form>
    </div>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';

export default {
    setup() {
        const isbn = ref('');
        const name = ref('');
        const error = ref(null); 

        const addBook = async () => {
            try {
                const response = await axios.post('https://your-api-endpoint.com/books', {
                    isbn: isbn.value,
                    name: name.value
                });
                console.log("Response:", response.data);
                error.value = null; 
         
                isbn.value = '';
                name.value = '';
            } catch (error) {
                console.error('Error:', error);
                error.value = 'Failed to add the book. Please try again.'; 
            }
        };

        return {
            isbn,
            name,
            addBook,
            error
        };
    }
};
</script>

<style scoped>
.error {
    color: red; 
}
</style>