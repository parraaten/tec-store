<template>
    <div class="gamer-container">
        <!-- Encabezado con estilo gamer -->
        <div class="gamer-header">
            <h2 class="gamer-title">🎮 Gestión de Productos Gamer</h2>
            <p class="gamer-subtitle">Administra tu catálogo de productos</p>
        </div>

        <!-- Tarjeta contenedora con efecto neón -->
        <div class="gamer-card">
            <!-- Botón para crear nuevo producto -->
            <el-button type="primary" class="create-button" @click="openCreateModal" icon="el-icon-plus">
                Nuevo Producto
            </el-button>

            <!-- Tabla de Productos con estilo gamer -->
            <el-table :data="products" style="width: 100%" :loading="loading" class="gamer-table">
                <el-table-column label="Producto" width="220">
                    <template #default="scope">
                        <div class="product-cell">
                            <el-image v-if="scope.row.image" :src="scope.row.image" fit="cover" class="product-image">
                                <template #error>
                                    <div class="image-error">
                                        <i class="el-icon-picture-outline"></i>
                                    </div>
                                </template>
                            </el-image>
                            <div class="product-info">
                                <strong>{{ scope.row.name }}</strong>
                                <small class="description-truncated">{{ scope.row.description }}</small>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="Precio" width="120" align="center">
                    <template #default="scope">
                        <span class="price-tag">{{ formatPrice(scope.row.price) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="Stock" prop="stock" width="100" align="center">
                    <template #default="scope">
                        <el-tag :type="scope.row.stock > 10 ? 'success' : scope.row.stock > 0 ? 'warning' : 'danger'">
                            {{ scope.row.stock }} unidades
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="Acciones" width="180" align="center">
                    <template #default="scope">
                        <el-tooltip content="Editar" placement="top">
                            <el-button size="small" type="primary" icon="el-icon-edit" circle
                                @click="openEditModal(scope.row)" />
                        </el-tooltip>
                        <el-tooltip content="Eliminar" placement="top">
                            <el-button size="small" type="danger" icon="el-icon-delete" circle
                                @click="deleteProduct(scope.row.id)" />
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- Modal para Crear/Editar Producto -->
        <el-dialog v-model="isModalVisible" :title="currentProduct.id ? 'Editar Producto' : 'Nuevo Producto'"
            width="600px" :before-close="closeModal" class="gamer-modal">
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

.gamer-table {
    border-radius: 8px;
    overflow: hidden;
    background-color: #2d3436;
    color: #dfe6e9;
}

.gamer-table :deep(.el-table__header) th {
    background-color: #201529;
    color: #dfe6e9;
    font-weight: bold;
}

.gamer-table :deep(.el-table__body) tr {
    background-color: #2d3436;
    color: #a1e3ff;
}

.gamer-table :deep(.el-table__body) tr:hover {
    background-color: #3d3d3d;
}

.product-cell {
    display: flex;
    align-items: center;
    gap: 15px;
}

.product-image {
    width: 50px;
    height: 50px;
    border-radius: 5px;
    object-fit: cover;
    background-color: #3d3d3d;
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

.product-info {
    display: flex;
    flex-direction: column;
}

.description-truncated {
    color: #b2bec3;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 150px;
}

.price-tag {
    font-weight: bold;
    color: #00b894;
}

.gamer-modal :deep(.el-dialog) {
    background-color: #2d3436;
    color: #dfe6e9;
    border-radius: 10px;
    border: 1px solid #6c5ce7;
}

.gamer-modal :deep(.el-dialog__title) {
    color: #a29bfe;
    font-weight: bold;
}

.gamer-modal :deep(.el-form-item__label) {
    color: #b2bec3;
}

.preview-image {
    width: 100px;
    height: 100px;
    border-radius: 5px;
    margin-top: 10px;
    border: 1px solid #3d3d3d;
    align-self: center;
}

.image-name {
    margin-left: 10px;
    color: #b2bec3;
    font-size: 0.9rem;
}

/* Efecto neón para los botones */
.el-button--primary {
    position: relative;
    overflow: hidden;
}

.el-button--primary:after {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, #6c5ce7, #a29bfe, #6c5ce7);
    background-size: 200% 200%;
    z-index: -1;
    border-radius: 4px;
    animation: gradient 3s ease infinite;
}

@keyframes gradient {
    0% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 100% 50%;
    }

    100% {
        background-position: 0% 50%;
    }
}

/* Responsive */
@media (max-width: 768px) {
    .product-cell {
        flex-direction: column;
        align-items: flex-start;
        gap: 5px;
    }

    .description-truncated {
        max-width: 100%;
    }
}
</style>