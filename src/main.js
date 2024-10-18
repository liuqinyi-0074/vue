import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import db from './firebase/init'
import PrimeVue from 'primevue/config'
import 'bootstrap/dist/css/bootstrap.min.css'
const app = createApp(App)

app.use(router)

app.config.globalProperties.$db = db
app.use(PrimeVue)
app.mount('#app')
