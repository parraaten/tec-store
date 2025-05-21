import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import CartView from '@/views/CartView.vue'
import ProductDetail from '@/views/ProductDetail.vue'
import AdminDashboard from '@/views/admin/Dashboard.vue'
import ProductsCRUD from '@/views/admin/ProductsCRUD.vue'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/cart',
    name: 'cart',
    component: CartView
  },
  {
    path: '/admin',
    name: 'admin-login',
    component: AdminDashboard
  },
  {
    path: '/product/:id',
    name: 'productDetail',
    component: ProductDetail
  },
  // Rutas protegidas
  {
    path: '/admin/dashboard',
    name: 'admin-dashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/products',
    name: 'admin-products',
    component: ProductsCRUD,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // Solo proteger rutas marcadas explícitamente
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Redirigir al login (ruta sin protección)
    next('/admin')
  } else {
    next()
  }
})


export default router