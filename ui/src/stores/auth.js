import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null)
    const isAuthenticated = ref(false)
    const router = useRouter()

    const isAdmin = computed(() => user.value?.id === 1)

    // Inicialización al cargar el store
    const init = () => {
        const token = localStorage.getItem('auth_token')
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
            isAuthenticated.value = true
        }
    }
    init()

    async function register(userData) {
        try {
            const response = await axios.post('/register', userData)
            const token = response.data.token
            
            if (!token) {
            throw new Error('No se recibió token en el registro')
            }
            
            localStorage.setItem('auth_token', token)
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
            isAuthenticated.value = true
            
            return response
        } catch (error) {
            console.error('Registration error:', error)
            throw error
        }
    }

    async function login(credentials) {
        try {
            const response = await axios.post('/login', credentials)
            const token = response.data.token
            
            if (!token) throw new Error('Token no recibido')
            
            localStorage.setItem('auth_token', token)
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
            
            // Obtener datos del usuario
            const userResponse = await axios.get('/user')
            user.value = userResponse.data
            isAuthenticated.value = true
            
            return response
        } catch (error) {
            logout()
            throw error
        }
    }

    function logout() {
        localStorage.removeItem('auth_token')
        delete axios.defaults.headers.common['Authorization']
        isAuthenticated.value = false
        user.value = null
        router.push('/admin')
    }

    return { 
        user, 
        isAuthenticated,
        isAdmin,
        register,
        login, 
        logout
    }
})