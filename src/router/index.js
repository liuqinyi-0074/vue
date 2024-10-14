import { createRouter, createWebHistory } from 'vue-router'
import AdminDashboard from '../views/AdminDashboard.vue'
import LoginPage from '../views/LoginPage.vue'
import SignUpPage from '../views/SignUpPage.vue'
import HomePage from '../views/HomePage.vue'
import FeedbackPage from '../views/FeedbackPage.vue'
import FirebaseSigninView from '../views/FirebaseSigninView.vue'
import FirebaseRegisterView from '../views/FirebaseRegisterView.vue'
import AddBookView from '../views/AddBookView.vue'
import BookListView from '../views/BookListView.vue'
import EditBookView from '../views/EditBookView.vue'
import GetBookCountView from '@/views/GetBookCountView.vue'
import WeatherView from '@/views/WeatherView.vue'

const routes = [
  { path: '/SignUpPage', name: 'SignUpPage', component: SignUpPage },
  { path: '/LoginPage', name: 'LoginPage', component: LoginPage },
  { path: '/AdminDashboard', name: 'AdminDashboard', component: AdminDashboard },
  { path: '/HomePage', name: 'HomePage', component: HomePage },
  { path: '/FeedbackPage', name: 'FeedbackPage', component: FeedbackPage },
  { path: '/FirebaseSignin', name: 'FireLogin', component: FirebaseSigninView },
  { path: '/FirebaseRegister', name: 'FireRegister', component: FirebaseRegisterView },
  { path: '/AddBook', name: 'AddBook', component: AddBookView },
  { path: '/EditBookView/:bookid', name: 'editBook', component: EditBookView },
  { path: '/GetBookCount', name: 'getBookCount', component: GetBookCountView },
  { path: '/BookList', name: 'BookListView', component: BookListView },
  { path: '/WeatherView', name: 'WeatherView', component: WeatherView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
