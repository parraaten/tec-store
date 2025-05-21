import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import CartView from '@/views/CartView.vue'
import RegisterView from '@/views/RegisterView.vue'
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
    path: '/register',
    name: 'register',
    component: RegisterView,
    meta: { requiresGuest: true } // Solo para usuarios no autenticados
  },
  // Rutas protegidas
  {
    path: '/admin/dashboard',
    name: 'admin-dashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true }
  },/*
  {
    path: '/admin/account',
    name: 'admin-account',
    component: () => import('@/views/admin/AccountView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/users',
    name: 'admin-users',
    component: () => import('@/views/admin/UsersView.vue'),
    meta: { 
      requiresAuth: true,
      requiresAdmin: true 
    }
  },*/
  {
    path: '/admin/products',
    name: 'admin-products',
    component: ProductsCRUD,
    meta: { 
      requiresAuth: true,
      requiresAdmin: true 
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Verificar autenticación primero
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next('/admin')
  }

  // Verificar rutas que requieren admin
  const adminRoutes = ['/admin/users', '/admin/products']
  if (adminRoutes.includes(to.path)) {
    if (!authStore.isAdmin) {
      // Redirigir a dashboard o mostrar error
      return next('/admin/dashboard')
    }
  }

  next()
})


export default router