<template>
    <div class="row mt-5">
        <h4>This is a PrimeVue Datatable.</h4>
        <DataTable :value="books" tableStyle="min-width: 50rem">
            <Column field="isbn" header="ISBN"></Column>
            <Column field="name" header="Name"></Column>
            <Column field="action" header="Action">
                <template #body="slotProps">
                    <p>{{ slotProps.data.id }}</p>
                    <button @click="navigateTOEditBook(slotProps.data.id)">Edit book</button>
                    <button @click="deleteBook(slotProps.data.id)">Remove book</button>
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import db from "../firebase/init.js";
import { collection, query, getDocs, deleteDoc, doc } from 'firebase/firestore'; // Import doc for deleting documents
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import router from '../router/index'; // Fixed the import path for router

const books = ref([]); // Initialize the books array

const fetchBooks = async () => {
    try {
        const q = query(collection(db, 'books'));
        const booksArray = []; // Initialize an array to hold book data
        const queryResult = await getDocs(q);
        queryResult.forEach((doc) => {
            booksArray.push({ id: doc.id, ...doc.data() }); // Corrected: Use booksArray instead of booksArray.value
        });
        books.value = booksArray; // Assign the array to the ref
        console.log("booklist", books.value);
    } catch (error) {
        console.error("Error fetching books: ", error);
    }
};

// Fetch books when the component mounts
onMounted(() => {
    fetchBooks();
});

const navigateTOEditBook = (id) => {
    router.push({ name: 'editBook', params: { bookid: id } });
}

const deleteBook = async (id) => {
    try {
        await deleteDoc(doc(db, "books", id));
        // Optionally, fetch the updated books list after deletion
        fetchBooks(); // Refresh the book list after deletion
        console.log("Book deleted successfully");
    } catch (error) {
        console.error("Delete error", error);
    }
};
</script>      