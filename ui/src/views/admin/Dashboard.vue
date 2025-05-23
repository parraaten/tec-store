<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div class="py-8 px-4 sm:px-6 lg:px-8">
        <!-- Sistema de autenticación -->
        <div v-if="!authStore.isAuthenticated" class="max-w-md mx-auto bg-gray-800 rounded-xl shadow-lg p-8">
            <h2 class="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-400 mb-6">LOGIN</h2>

            <div v-if="loginError" class="mb-4 p-3 bg-red-900/50 text-red-300 rounded-lg text-sm">
                Credenciales incorrectas
            </div>

            <div class="space-y-4">
                <div>
                    <label class="block text-gray-400 text-sm mb-1">Correo electrónico</label>
                    <input v-model="email" type="text"
                        class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="admin@tstore.com">
                </div>

                <div>
                    <label class="block text-gray-400 text-sm mb-1">Contraseña</label>
                    <input v-model="password" type="password"
                        class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="••••••••">
                </div>
                <div class="text-center text-gray-400 text-sm mt-4">
                    ¿No tienes cuenta? 
                    <router-link to="/register" class="text-orange-400 hover:underline">Regístrate aquí</router-link>
                </div>

                <button @click="handleLogin"
                    class="w-full mt-6 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold py-3 rounded-lg hover:from-orange-600 hover:to-yellow-600 transition-all">
                    INGRESAR
                </button>
            </div>
        </div>

        <!-- Dashboard principal -->
        <div v-else class="max-w-6xl mx-auto">
            <!-- Encabezado -->
            <div class="flex justify-between items-center mb-8">
                <h2
                    class="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-400">
                    PANEL DE CONTROL
                </h2>
                <button @click="authStore.logout"
                    class="flex items-center text-gray-400 hover:text-red-400 transition-colors">
                    <el-icon class="mr-1">
                        <SwitchButton />
                    </el-icon>
                    Cerrar sesión
                </button>
            </div>

            <!-- Módulos principales -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 py-10">
                <!-- Módulo de Cuenta -->
            <router-link :to="`/admin/account/${authStore.user.id}`"
                class="group bg-gray-800 hover:bg-gray-700 rounded-xl p-6 shadow-lg border border-gray-700 hover:border-blue-500 transition-all">
                <div class="flex items-center">
                    <div class="p-3 bg-blue-500/20 rounded-lg mr-4 group-hover:bg-blue-500/30 transition">
                        <el-icon :size="24" class="text-blue-400">
                            <User />
                        </el-icon>
                    </div>
                    <div>
                        <h2 class="text-xl font-semibold text-white mb-1">Mi Cuenta</h2>
                        <p class="text-gray-400">Administra tu información personal</p>
                    </div>
                    <el-icon class="ml-auto text-gray-500 group-hover:text-blue-400 transition">
                        <ArrowRight />
                    </el-icon>
                </div>
            </router-link>

            <!-- Módulo de Usuarios -->
            <router-link 
                v-if="authStore.isAdmin"
                to="/admin/users" 
                class="group bg-gray-800 hover:bg-gray-700 rounded-xl p-6 shadow-lg border border-gray-700 hover:border-green-500 transition-all">
                <div class="flex items-center">
                    <div class="p-3 bg-green-500/20 rounded-lg mr-4 group-hover:bg-green-500/30 transition">
                        <el-icon :size="24" class="text-green-400">
                            <Service />
                        </el-icon>
                    </div>
                    <div>
                        <h2 class="text-xl font-semibold text-white mb-1">Usuarios</h2>
                        <p class="text-gray-400">Administra los usuarios del sistema</p>
                    </div>
                    <el-icon class="ml-auto text-gray-500 group-hover:text-green-400 transition">
                        <ArrowRight />
                    </el-icon>
                </div>
            </router-link>

            <!-- Módulo de Productos (existente) -->
            <router-link 
                v-if="authStore.isAdmin"
                to="/admin/products"
                class="group bg-gray-800 hover:bg-gray-700 rounded-xl p-6 shadow-lg border border-gray-700 hover:border-orange-500 transition-all">
                <div class="flex items-center">
                    <div class="p-3 bg-orange-500/20 rounded-lg mr-4 group-hover:bg-orange-500/30 transition">
                        <el-icon :size="24" class="text-orange-400">
                            <Box />
                        </el-icon>
                    </div>
                    <div>
                        <h2 class="text-xl font-semibold text-white mb-1">Productos</h2>
                        <p class="text-gray-400">Administra tu catálogo de productos</p>
                    </div>
                    <el-icon class="ml-auto text-gray-500 group-hover:text-orange-400 transition">
                        <ArrowRight />
                    </el-icon>
                </div>
            </router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue' // Añade onMounted al import
import { Box, ArrowRight, SwitchButton, User, Service } from '@element-plus/icons-vue' // Añade los nuevos íconos
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const email = ref('')
const password = ref('')
const loginError = ref(false)

const handleLogin = async () => {
    try {
        await authStore.login({
            email: email.value,
            password: password.value
        })
        loginError.value = false
        // Redirige al dashboard protegido después del login
        router.push('/admin/dashboard')
    } catch (err) {
        loginError.value = true
        password.value = ''
        console.error('Login error:', err)
    }
}

onMounted(async () => {
  console.log('Auth state:', authStore.isAuthenticated, 'Admin state:', authStore.isAdmin)
  
  // Si hay token pero no hay usuario cargado
  if (localStorage.getItem('auth_token') && !authStore.user) {
    await authStore.loadUser()
  }

  // Si ya está autenticado pero está en /admin, redirige al dashboard
  if (authStore.isAuthenticated && router.currentRoute.value.path === '/admin') {
    router.push('/admin/dashboard')
  }
})
</script>

<style scoped>
.group:hover {
    transform: translateY(-2px);
}
</style>