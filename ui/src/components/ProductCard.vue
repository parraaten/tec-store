<template>
    <div
        class="bg-gray-900 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition h-full flex flex-col border border-gray-700 group">
        <!-- Contenedor de imagen con efecto hover -->
        <div class="relative pt-[75%] overflow-hidden">
            <img :src="productImage" @error="handleImageError"
                class="absolute top-0 left-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                :alt="product.name">
            <!-- Badge de estado -->
            <div class="absolute top-2 right-2 flex flex-col space-y-1">
                <span v-if="product.stock <= 0" class="bg-red-600 text-white text-xs px-2 py-1 rounded-full shadow-md">
                    AGOTADO
                </span>
                <span v-else-if="product.stock < 5"
                    class="bg-yellow-500 text-gray-900 text-xs px-2 py-1 rounded-full shadow-md font-bold">
                    ÚLTIMAS UNIDADES
                </span>
            </div>
        </div>

        <!-- Contenido de la tarjeta -->
        <div class="p-4 flex-grow flex flex-col">
            <div class="mb-2">
                <h3
                    class="text-white font-bold text-lg mb-1 line-clamp-1 group-hover:text-orange-400 transition-colors">
                    {{ product.name }}</h3>
                <div v-if="product.stock > 0" class="flex items-center">
                    <div class="w-full bg-gray-700 rounded-full h-1.5">
                        <div class="bg-green-500 h-1.5 rounded-full"
                            :style="{ width: `${Math.min(100, (product.stock / 10) * 100)}%` }"></div>
                    </div>
                    <span class="text-xs text-gray-400 ml-2 whitespace-nowrap">{{ product.stock }} en stock</span>
                </div>
            </div>

            <p class="text-gray-400 text-sm mb-4 line-clamp-2 flex-grow">{{ product.description || 'Descripción no disponible' }}</p>

            <div class="flex justify-between items-center mt-auto">
                <div class="flex items-end">
                    <span class="text-orange-400 font-bold text-xl">${{ formatPrice(product.price) }}</span>
                    <span v-if="product.originalPrice" class="text-gray-500 text-xs line-through ml-2 mb-0.5">${{
                        formatPrice(product.originalPrice) }}</span>
                </div>
                <el-button type="warning" size="small" @click.stop="addToCart(product)" :disabled="product.stock <= 0"
                    class="!px-4 !py-2 !bg-gradient-to-r from-orange-500 to-yellow-500 !border-0 !text-white !font-bold hover:from-orange-600 hover:to-yellow-600 transition-all">
                    <el-icon class="mr-1">
                        <Plus />
                    </el-icon>
                    AÑADIR
                </el-button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Plus } from '@element-plus/icons-vue'
import { useCartStore } from '@/stores/cart'
import { ElNotification } from 'element-plus'
import { computed, ref } from 'vue'

const props = defineProps({
    product: {
        type: Object,
        required: true,
        default: () => ({
            id: null,
            name: 'Producto sin nombre',
            description: '',
            price: 0,
            originalPrice: null,
            stock: 0,
            image: null
        })
    }
})

const imageError = ref(false)

const productImage = computed(() => {
    if (imageError.value || !props.product.image) {
        return '/placeholder-product.webp'
    }
    return props.product.image.startsWith('http') ? props.product.image : `/storage/${props.product.image}`
})

const handleImageError = () => {
    imageError.value = true
}

const formatPrice = (price) => {
    return Number(price).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

const cartStore = useCartStore()

const addToCart = (product) => {
    if (product.stock <= 0) return

    cartStore.addItem(product)
    ElNotification({
        title: '¡Producto añadido!',
        message: `${product.name} fue añadido al carrito`,
        type: 'success',
        position: 'bottom-right',
        duration: 2000,
        customClass: 'gamer-notification'
    })
}
</script>

<style scoped>
.line-clamp-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* Efecto de borde neón al hacer hover */
.group:hover {
    box-shadow: 0 0 10px rgba(251, 146, 60, 0.5);
}

/* Estilo para la notificación */
:deep(.gamer-notification) {
    background: #1e293b;
    border: 1px solid #f59e0b;
    color: white;
}
</style>