<template>
    <div class="gamer-container">
        <!-- Encabezado con estilo gamer -->
        <div class="gamer-header">
            <h2 class="gamer-title">🎮 Gestión de Productos Gamer</h2>
            <p class="gamer-subtitle">Administra tu catálogo de productos</p>
        </div>

        <!-- Tarjeta contenedora -->
        <div class="gamer-card">
            <!-- Botón para crear nuevo producto -->
            <el-button type="primary" class="create-button" @click="openCreateModal">
                <el-icon>
                    <plus />
                </el-icon>
                <span>Nuevo Producto</span>
            </el-button>

            <!-- Tabla de Productos con nuevo diseño -->
            <div class="bg-gray-800 rounded-lg shadow overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-700">
                        <thead class="bg-gray-700">
                            <tr>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                    Producto</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                    Descripción</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                    Precio</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                    Stock</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-gray-800 divide-y divide-gray-700">
                            <tr v-for="product in products" :key="product.id" class="hover:bg-gray-750">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center">
                                        <el-image v-if="product.image" :src="product.image" fit="cover"
                                            class="w-10 h-10 rounded-md mr-3">
                                            <template #error>
                                                <div
                                                    class="w-10 h-10 bg-gray-700 flex items-center justify-center rounded-md">
                                                    <el-icon>
                                                        <Picture />
                                                    </el-icon>
                                                </div>
                                            </template>
                                        </el-image>
                                        <span class="text-sm text-gray-300">{{ product.name }}</span>
                                    </div>
                                </td>
                                <td class="px-6 py-4">
                                    <p class="text-sm text-gray-300 line-clamp-2">{{ product.description }}</p>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-green-400">
                                    {{ formatPrice(product.price) }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span :class="{
                                        'px-2 py-1 rounded-full text-xs': true,
                                        'bg-green-900 text-green-300': product.stock > 10,
                                        'bg-yellow-900 text-yellow-300': product.stock > 0 && product.stock <= 10,
                                        'bg-red-900 text-red-300': product.stock === 0
                                    }">
                                        {{ product.stock }} unidades
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center space-x-2">
                                        <!-- Botón Editar - Color azul -->
                                        <button @click="openEditModal(product)"
                                            class="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                                            title="Editar producto">
                                            <el-icon>
                                                <EditPen />
                                            </el-icon>
                                        </button>

                                        <!-- Botón Eliminar - Color rojo -->
                                        <button @click="deleteProduct(product.id)"
                                            class="p-1 text-red-400 hover:text-red-300 transition-colors"
                                            title="Eliminar producto">
                                            <el-icon>
                                                <Delete />
                                            </el-icon>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Cargando -->
            <div v-if="loading" class="mt-8 text-center text-gray-400">
                Cargando productos...
            </div>
        </div>

        <!-- Modal para Crear/Editar Producto -->
        <el-dialog v-model="isModalVisible" :title="currentProduct.id ? 'Editar Producto' : 'Nuevo Producto'"
            :before-close="closeModal" class="gamer-modal" style="min-width: 400px;">
            <el-form :model="currentProduct" ref="productForm" label-position="top">
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="Nombre del producto" prop="name"
                            :rules="[{ required: true, message: 'El nombre es obligatorio', trigger: 'blur' }]">
                            <el-input v-model="currentProduct.name" placeholder="Ej. Teclado Mecánico RGB" size="large">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="Descripción" prop="description">
                            <el-input v-model="currentProduct.description" type="textarea" :rows="3"
                                placeholder="Describe las características del producto">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="Precio ($)" prop="price" :rules="[
                            { required: true, message: 'El precio es obligatorio', trigger: 'blur' },
                            { type: 'number', min: 0, message: 'El precio debe ser mayor a 0', trigger: 'blur' }
                        ]">
                            <el-input-number v-model="currentProduct.price" :min="0" :step="1" controls-position="right"
                                style="width: 100%">
                            </el-input-number>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="Stock disponible" prop="stock" :rules="[
                            { required: true, message: 'El stock es obligatorio', trigger: 'blur' },
                            { type: 'number', min: 0, message: 'El stock no puede ser negativo', trigger: 'blur' }
                        ]">
                            <el-input-number v-model="currentProduct.stock" :min="0" controls-position="right"
                                style="width: 100%">
                            </el-input-number>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="Imagen del producto">
                            <el-upload class="upload-demo" action="#" :on-change="handleImageChange"
                                :auto-upload="false" :show-file-list="false">
                                <div class="image-preview-list">

                                    <el-image v-if="currentProduct.image && typeof currentProduct.image === 'string'"
                                        :src="currentProduct.image" fit="cover" class="preview-image"
                                        :preview-src-list="[currentProduct.image]">
                                    </el-image>
                                    <span v-if="currentProduct.imageFile" class="image-name">
                                        {{ currentProduct.imageFile.name || 'Imagen seleccionada' }}
                                    </span>
                                    <el-button type="primary" size="small">Seleccionar imagen</el-button>
                                </div>

                                <template #tip>
                                    <div class="el-upload__tip">
                                        Sube una imagen del producto (JPG/PNG, máximo 2MB)
                                    </div>
                                </template>
                            </el-upload>

                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>

            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="closeModal" size="medium">Cancelar</el-button>
                    <el-button type="primary" @click="saveProduct" size="medium" :loading="saving">
                        {{ currentProduct.id ? 'Actualizar' : 'Crear' }}
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Delete, EditPen, Plus, Picture } from '@element-plus/icons-vue'
import axios from '@/config/axios'
import { ElNotification, ElMessageBox } from 'element-plus'
import { useAuthStore } from '@/stores/auth'

const products = ref([])
const loading = ref(true)
const saving = ref(false)
const isModalVisible = ref(false)

const currentProduct = ref({
    id: null,
    name: '',
    description: '',
    price: 0,
    stock: 0,
    image: null,
    imageFile: null
})

// Cargar los productos al montar el componente
onMounted(async () => {
    await loadProducts()
})

// Función para cargar los productos
const loadProducts = async () => {
    try {
        loading.value = true;
        const response = await axios.get('/products', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            }
        });
        products.value = response.data;
    } catch (error) {
        console.error('Error cargando los productos:', error);
        if (error.response?.status === 401) {
            const authStore = useAuthStore();
            authStore.logout();
        }
        ElNotification({
            title: 'Error',
            message: 'No se pudieron cargar los productos',
            type: 'error'
        });
    } finally {
        loading.value = false;
    }
}

// Formato de precio
const formatPrice = (price) => {
    return `$${parseFloat(price).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
}

// Abrir el modal para crear un producto
const openCreateModal = () => {
    currentProduct.value = {
        id: null,
        name: '',
        description: '',
        price: 0,
        stock: 0,
        image: null,
        imageFile: null
    }
    isModalVisible.value = true
}

// Abrir el modal para editar un producto
const openEditModal = (product) => {
    currentProduct.value = {
        ...product,
        imageFile: null
    }
    isModalVisible.value = true
}

// Cerrar el modal
const closeModal = () => {
    isModalVisible.value = false
}

// Manejar cambio de imagen
const handleImageChange = (file) => {
    // Revocar URL anterior si existe para evitar fuga de memoria
    if (currentProduct.value.image) {
        URL.revokeObjectURL(currentProduct.value.image)
    }
    currentProduct.value.imageFile = file.raw
    currentProduct.value.image = URL.createObjectURL(file.raw) // Crear una URL temporal para previsualizar la imagen seleccionada localmente
}

// Guardar un producto (crear o actualizar)
// En el método saveProduct del componente
const saveProduct = async () => {
    saving.value = true;
    try {
        // Verificar autenticación primero
        const authStore = useAuthStore();
        if (!authStore.isAuthenticated) {
            throw new Error('No autenticado');
        }

        const formData = new FormData();
        formData.append('name', currentProduct.value.name);
        formData.append('description', currentProduct.value.description);
        formData.append('price', currentProduct.value.price);
        formData.append('stock', currentProduct.value.stock);

        if (currentProduct.value.id) {
            formData.append('_method', 'PUT');
        }

        if (currentProduct.value.imageFile) {
            formData.append('image', currentProduct.value.imageFile);
        }

        const url = currentProduct.value.id
            ? `/products/${currentProduct.value.id}`
            : '/products';

        // eslint-disable-next-line no-unused-vars
        const response = await axios.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            }
        });

        ElNotification({
            title: 'Éxito',
            message: currentProduct.value.id
                ? 'Producto actualizado correctamente'
                : 'Producto creado correctamente',
            type: 'success'
        });

        await loadProducts();
        closeModal();
    } catch (error) {
        console.error('Error guardando el producto:', error);

        if (error.response?.status === 401) {
            // Token inválido o expirado
            const authStore = useAuthStore();
            authStore.logout();
            ElNotification({
                title: 'Sesión expirada',
                message: 'Por favor inicie sesión nuevamente',
                type: 'warning',
                duration: 5000
            });
        } else {
            ElNotification({
                title: 'Error',
                message: error.response?.data?.message || 'No se pudo guardar el producto',
                type: 'error',
                duration: 5000
            });
        }
    } finally {
        saving.value = false;
    }
}

// Eliminar un producto
const deleteProduct = async (productId) => {
    try {
        await ElMessageBox.confirm(
            'Esta acción eliminará permanentemente el producto. ¿Continuar?',
            'Confirmar eliminación',
            {
                confirmButtonText: 'Eliminar',
                cancelButtonText: 'Cancelar',
                type: 'warning',
                center: true
            }
        )

        await axios.delete(`/products/${productId}`)
        ElNotification({
            title: 'Éxito',
            message: 'Producto eliminado correctamente',
            type: 'success'
        })
        loadProducts()
    } catch (error) {
        if (error !== 'cancel') {
            console.error('Error eliminando el producto:', error)
            ElNotification({
                title: 'Error',
                message: 'No se pudo eliminar el producto',
                type: 'error'
            })
        }
    }
}
onMounted(async () => {
    const authStore = useAuthStore();
    if (!authStore.isAuthenticated) {
        await authStore.init(); // Intenta verificar el token
    }
    await loadProducts();
});
</script>

<style scoped>
/* Mantener los estilos gamer del contenedor */
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

.create-button {
    background-color: #6c5ce7;
    border-color: #6c5ce7;
    font-weight: bold;
    transition: all 0.3s;
    margin-bottom: 20px;
}

.create-button:hover {
    background-color: #5649c0;
    border-color: #5649c0;
    transform: translateY(-2px);
}

/* Estilos para la nueva tabla */
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

.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.text-red-400 {
    color: #ff7675;
}

.text-red-400:hover {
    color: #ff5252;
}

/* Estilos para el modal */
.gamer-modal {
    border-radius: 12px;
    overflow: hidden;
}

.gamer-modal .el-dialog {
    background: #2d3436;
    color: #dfe6e9;
    border: 1px solid #6c5ce7;
    box-shadow: 0 0 20px rgba(108, 92, 231, 0.3);
}

.gamer-modal .el-dialog__header {
    border-bottom: 1px solid #3d3d3d;
    padding: 20px;
}

.gamer-modal .el-dialog__title {
    color: #a29bfe;
    font-size: 1.5rem;
    font-weight: bold;
}

.gamer-modal .el-dialog__body {
    padding: 20px;
    max-height: 70vh;
    overflow-y: auto;
}

.modal-content-container {
    padding: 10px;
}

/* Estilos para el formulario */
.gamer-modal .el-form-item__label {
    color: #b2bec3;
    font-weight: 500;
}

.gamer-modal .el-input__inner,
.gamer-modal .el-textarea__inner {
    background-color: #3d3d3d;
    border: 1px solid #4a4a4a;
    color: #dfe6e9;
}

.gamer-modal .el-input-number__decrease,
.gamer-modal .el-input-number__increase {
    background-color: #4a4a4a;
    color: #dfe6e9;
}

/* Estilos para la carga de imágenes */
.image-upload-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.image-preview {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-top: 10px;
}

.preview-image {
    width: 100px;
    height: 100px;
    border-radius: 8px;
    border: 1px solid #4a4a4a;
    object-fit: cover;
}

.image-error {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #3d3d3d;
    color: #6c5ce7;
}

.image-name {
    color: #b2bec3;
    font-size: 0.9rem;
}

.el-upload__tip {
    color: #7f8c8d;
    font-size: 0.8rem;
    margin-top: 5px;
}

/* Estilos para el footer del modal */
.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 10px 20px;
    border-top: 1px solid #3d3d3d;
}
</style>