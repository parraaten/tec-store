<template>
    <div class="gamer-container">
        <!-- Encabezado con estilo gamer -->
        <div class="gamer-header">
            <h2 class="gamer-title">👥 Gestión de Usuarios</h2>
            <p class="gamer-subtitle">Administra los usuarios del sistema</p>
        </div>

        <!-- Tarjeta contenedora -->
        <div class="gamer-card">
            <!-- Tabla de usuarios -->
            <div class="bg-gray-800 rounded-lg shadow overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-700">
                        <thead class="bg-gray-700">
                            <tr>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                    ID</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                    Nombre</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                    Email</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                    Registro</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-gray-800 divide-y divide-gray-700">
                            <tr v-for="user in users" :key="user.id" class="hover:bg-gray-750">
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{{ user.id }}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{{ user.name }}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{{ user.email }}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{{
                                    formatDate(user.created_at) }}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                    <button @click="deleteUser(user.id)" :disabled="user.id === 1"
                                        class="text-red-400 hover:text-red-300 disabled:text-gray-500 disabled:cursor-not-allowed"
                                        title="Eliminar usuario">
                                        <el-icon>
                                            <Delete />
                                        </el-icon>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Cargando -->
            <div v-if="loading" class="mt-8 text-center text-gray-400">
                Cargando usuarios...
            </div>

            <!-- Mensaje de error -->
            <div v-if="error" class="mt-4 p-3 bg-red-900/50 text-red-300 rounded-lg text-sm">
                {{ error }}
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Delete } from '@element-plus/icons-vue'
import { ElMessageBox, ElNotification } from 'element-plus'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const users = ref([])
const loading = ref(true)
const error = ref(null)

// Formatear fecha
const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
}

// Obtener usuarios
const fetchUsers = async () => {
    try {
        loading.value = true
        const response = await axios.get('/users')
        users.value = response.data
    } catch (err) {
        error.value = err.response?.data?.message || 'Error al cargar usuarios'
        console.error('Error fetching users:', err)
    } finally {
        loading.value = false
    }
}

// Eliminar usuario
const deleteUser = async (userId) => {
    try {
        // Evitar que se elimine el admin principal (id = 1)
        if (userId === 1) {
            ElNotification({
                title: 'Error',
                message: 'No puedes eliminar al administrador principal',
                type: 'error',
                duration: 3000
            })
            return
        }

        await ElMessageBox.confirm(
            '¿Estás seguro de eliminar este usuario permanentemente? Esta acción no se puede deshacer.',
            'Confirmar eliminación',
            {
                confirmButtonText: 'Eliminar',
                cancelButtonText: 'Cancelar',
                type: 'warning',
                center: true,
                customClass: 'delete-confirm-dialog',
                confirmButtonClass: 'confirm-delete-button',
                cancelButtonClass: 'cancel-delete-button'
            }
        )

        await axios.delete(`/users/${userId}`)

        ElNotification({
            title: 'Éxito',
            message: 'Usuario eliminado correctamente',
            type: 'success',
            duration: 3000
        })

        await fetchUsers() // Recargar la lista de usuarios
    } catch (error) {
        if (error !== 'cancel') {
            console.error('Error eliminando usuario:', error)
            ElNotification({
                title: 'Error',
                message: error.response?.data?.message || 'No se pudo eliminar el usuario',
                type: 'error',
                duration: 3000
            })
        }
    }
}

// Cargar usuarios al montar el componente
onMounted(() => {
    if (authStore.isAdmin) {
        fetchUsers()
    }
})
</script>

<style scoped>
.gamer-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 20px;
}

.gamer-header {
    text-align: center;
    margin-bottom: 30px;
    padding: 20px;
    background: linear-gradient(135deg, #1e1e2f 0%, #2a2a40 100%);
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    color: white;
    border-left: 5px solid #6c5ce7;
}

.gamer-title {
    font-size: 2.2rem;
    font-weight: 700;
    margin-bottom: 5px;
    background: linear-gradient(to right, #6c5ce7, #a29bfe);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.gamer-subtitle {
    font-size: 1rem;
    color: #a29bfe;
    margin-top: 0;
}

.gamer-card {
    background-color: #2d3436;
    border-radius: 10px;
    padding: 25px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    border: 1px solid #3d3d3d;
}

/* Estilos para la tabla */
.bg-gray-800 {
    background-color: #2d3436;
}

.bg-gray-700 {
    background-color: #201529;
}

.hover\:bg-gray-750:hover {
    background-color: #3d3d3d;
}

.text-gray-300 {
    color: #dfe6e9;
}

.text-red-400 {
    color: #ff7675;
}

.text-red-400:hover {
    color: #ff5252;
}
</style>