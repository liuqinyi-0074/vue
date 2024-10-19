import { createRouter, createWebHistory } from 'vue-router'
import AdminDashboard from '../views/AdminDashboard.vue'
import LoginPage from '../views/LoginPage.vue'
import HomePage from '../views/HomePage.vue'
import FeedbackPage from '../views/FeedbackPage.vue'
import FirebaseSigninView from '../views/FirebaseSigninView.vue'
import FirebaseRegisterView from '../views/FirebaseRegisterView.vue'
import MapFirst from '../components/mapFirst.vue'

const routes = [
  { path: '/LoginPage', name: 'LoginPage', component: LoginPage },
  {
    path: '/AdminDashboard',
    name: 'AdminDashboard',
    component: AdminDashboard
  },
  { path: '/HomePage', name: 'HomePage', component: HomePage },
  { path: '/FeedbackPage', name: 'FeedbackPage', component: FeedbackPage },
  { path: '/FirebaseSigninView', name: 'FirebaseSigninView', component: FirebaseSigninView },
  { path: '/mapFirst', name: 'Map', component: MapFirst },
  { path: '/FirebaseRegisterView', name: 'FirebaseRegisterView', component: FirebaseRegisterView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
