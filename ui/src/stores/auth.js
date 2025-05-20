import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null)
    const isAuthenticated = ref(false)
    const router = useRouter()

    // Inicialización al cargar el store
    const init = () => {
        const token = localStorage.getItem('auth_token')
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
            isAuthenticated.value = true
        }
    }
    init()

    async function login(credentials) {
        try {
            const response = await axios.post('/login', credentials)
            
            // Asegúrate que la respuesta tiene la estructura correcta
            if (!response.data || !response.data.token) {
                throw new Error('Respuesta inválida del servidor')
            }
            
            const token = response.data.token
            localStorage.setItem('auth_token', token)
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
            isAuthenticated.value = true
            
            return response
        } catch (err) {
            console.error('Error en login:', err.response ? err.response.data : err.message)
            logout()
            throw err // Re-lanzamos el error para manejarlo en el componente
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
        login, 
        logout 
    }
})