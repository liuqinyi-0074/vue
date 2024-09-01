import { createRouter, createWebHistory } from 'vue-router'
import AdminDashboard from '../views/AdminDashboard.vue'
import LoginPage from '../views/LoginPage.vue'
import SignUpPage from '../views/SignUpPage.vue'
import HomePage from '../views/HomePage.vue'
import FeedbackPage from '../views/FeedbackPage.vue'

const routes = [
  {
    path: '/SignUpPage',
    name: 'SignUpPage',
    component: SignUpPage
  },
  { path: '/LoginPage', name: 'LoginPage', component: LoginPage },
  {
    path: '/AdminDashboard',
    name: 'AdminDashboard',
    component: AdminDashboard
  },
  { path: '/HomePage', name: 'HomePage', component: HomePage },
  { path: '/FeedbackPage', name: 'FeedbackPage', component: FeedbackPage }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
