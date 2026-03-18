import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Home from './components/Home.vue'
import CategoryPage from './components/CategoryPage.vue'
import ReviewsPage from './components/ReviewsPage.vue'
import AboutPage from './components/AboutPage.vue'
import AdminPage from './components/AdminPage.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: AboutPage },
  { path: '/category/:type', component: CategoryPage, props: true },
  { path: '/reviews', component: ReviewsPage },
  { path: '/admin', component: AdminPage }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

const app = createApp(App)
app.use(router)
app.mount('#app')
