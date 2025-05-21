<template>
    <div class="py-8 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md mx-auto bg-gray-800 rounded-xl shadow-lg p-8">
            <h2 class="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-400 mb-6">REGISTRO DE USUARIO</h2>

            <div v-if="registerError" class="mb-4 p-3 bg-red-900/50 text-red-300 rounded-lg text-sm">
                {{ errorMessage }}
            </div>

            <form @submit.prevent="handleRegister" class="space-y-4">
                <div>
                    <label class="block text-gray-400 text-sm mb-1">Nombre completo</label>
                    <input v-model="form.name" type="text" required
                        class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500">
                </div>

                <div>
                    <label class="block text-gray-400 text-sm mb-1">Correo electrónico</label>
                    <input v-model="form.email" type="email" required
                        class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500">
                </div>

                <div>
                    <label class="block text-gray-400 text-sm mb-1">Contraseña</label>
                    <input v-model="form.password" type="password" required minlength="8"
                        class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500">
                </div>

                <div>
                    <label class="block text-gray-400 text-sm mb-1">Confirmar contraseña</label>
                    <input v-model="form.password_confirmation" type="password" required
                        class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500">
                </div>

                <button type="submit"
                    class="w-full mt-6 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold py-3 rounded-lg hover:from-orange-600 hover:to-yellow-600 transition-all">
                    REGISTRARSE
                </button>

                <div class="text-center text-gray-400 text-sm mt-4">
                    ¿Ya tienes cuenta?
                    <router-link to="/admin" class="text-orange-400 hover:underline">Inicia sesión</router-link>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const form = ref({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
})

const registerError = ref(false)
const errorMessage = ref('')

const handleRegister = async () => {
    try {
        if (form.value.password !== form.value.password_confirmation) {
            throw new Error('Las contraseñas no coinciden')
        }

        await authStore.register(form.value)
        router.push('/admin/dashboard')
    } catch (err) {
        registerError.value = true
        errorMessage.value = err.response?.data?.message || err.message
        console.error('Registration error:', err)
    }
}
</script>