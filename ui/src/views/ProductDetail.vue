<template>
  <div v-if="loading" class="text-center text-white mt-10 text-xl">Cargando...</div>

  <div v-else-if="product" class="bg-gray-900 rounded-2xl shadow-2xl border border-gray-700 p-6 max-w-5xl mx-auto mt-10">
    <div class="flex flex-col md:flex-row gap-8">
      <!-- Imagen del producto -->
      <div class="w-full md:w-1/2 relative">
        <img
          :src="productImage"
          @error="handleImageError"
          class="w-full rounded-xl object-cover aspect-[4/3] border border-gray-800 shadow-lg"
          :alt="product.name"
        />
        <div class="absolute top-4 right-4 space-y-2">
          <span
            v-if="product.stock <= 0"
            class="bg-red-600 text-white text-xs px-3 py-1 rounded-full shadow-md"
          >
            AGOTADO
          </span>
          <span
            v-else-if="product.stock < 5"
            class="bg-yellow-500 text-gray-900 text-xs px-3 py-1 rounded-full font-bold shadow-md"
          >
            ÚLTIMAS UNIDADES
          </span>
        </div>
      </div>

      <!-- Detalles -->
      <div class="flex flex-col justify-between w-full md:w-1/2 text-gray-100">
        <div>
          <h1 class="text-3xl font-bold mb-2 text-white">{{ product.name }}</h1>
        
          <!-- Stock -->
          <div v-if="product.stock > 0" class="mb-4">
            <div class="flex items-center">
              <div class="w-full bg-gray-700 rounded-full h-2">
                <div
                  class="bg-green-500 h-2 rounded-full"
                  :style="{ width: `${Math.min(100, (product.stock / 10) * 100)}%` }"
                ></div>
              </div>
              <span class="text-sm text-gray-400 ml-2 whitespace-nowrap">
                {{ product.stock }} en stock
              </span>
            </div>
             <p class="text-gray-400 mb-4 text-lg">
            {{ product.description || 'Descripción no disponible' }}
          </p>
          </div>
        </div>

        <!-- Precio y botón -->
        <div class="flex justify-between items-center mt-6">
          <div class="flex items-end">
            <span class="text-orange-400 font-bold text-3xl">
              ${{ formatPrice(product.price) }}
            </span>
            <span
              v-if="product.originalPrice"
              class="text-gray-500 text-sm line-through ml-3 mb-1"
            >
              ${{ formatPrice(product.originalPrice) }}
            </span>
          </div>

          <el-button
            type="warning"
            size="large"
            @click="addToCart(product)"
            :disabled="product.stock <= 0"
            class="!px-6 !py-3 !bg-gradient-to-r from-orange-500 to-yellow-500 !border-0 !text-white !font-bold hover:from-orange-600 hover:to-yellow-600 transition-all"
          >
            <el-icon class="mr-1"><Plus /></el-icon>
            AÑADIR AL CARRITO
          </el-button>
        </div>
      </div>
    </div>
  </div>


  <div v-else class="text-white text-center mt-10">
    <p>Producto no encontrado.</p>
  </div>

     <div class="flex justify-center items-center mt-6 space-x-1 text-yellow-400 text-2xl">
        <el-icon v-for="n in 5" :key="n">
        <Star/>
        </el-icon>
    </div>

<div class="max-w-3xl mx-auto mt-10 text-white">
  <h2 class="text-2xl font-bold mb-4">Reseñas</h2>

  <!-- Lista de reseñas -->
  <div v-if="reviews.length">
    <div
      v-for="review in reviews"
      :key="review.id"
      class="bg-gray-800 p-4 rounded-lg mb-4 border border-gray-700"
    >
      <div class="flex items-center mb-2">
        <strong class="text-yellow-400">{{ review.user?.name || 'Anónimo' }}</strong>
        <div class="flex ml-4 text-yellow-400 text-lg">
          <el-icon v-for="n in 5" :key="n">
            <Star :class="{ 'opacity-100': n <= review.rating, 'opacity-20': n > review.rating }" />
          </el-icon>
        </div>
      </div>
      <p class="text-gray-300">{{ review.comment }}</p>
    </div>
  </div>
  <div v-else class="text-gray-400">Este producto aún no tiene reseñas.</div>

  <!-- Formulario de reseña -->
  <form v-if="authStore.isAuthenticated" @submit.prevent="submitReview" class="mt-6 space-y-4 bg-gray-800 p-4 rounded-lg border border-gray-700">
    <h3 class="text-xl font-semibold">Escribir una reseña</h3>
    <div>
      <label class="block mb-1">Comentario</label>
      <textarea v-model="newReview.comment" class="w-full p-2 rounded bg-gray-900 border border-gray-600 text-white" required></textarea>
    </div>
    <div>
      <label class="block mb-1">Calificación</label>
      <select v-model="newReview.rating" class="w-full p-2 rounded bg-gray-900 border border-gray-600 text-white" required>
        <option disabled value="">Selecciona una calificación</option>
        <option v-for="n in 5" :key="n" :value="n">{{ n }} estrella{{ n > 1 ? 's' : '' }}</option>
      </select>
    </div>
    <el-button type="primary" native-type="submit" class="!bg-blue-600 hover:!bg-blue-700">
      Enviar reseña
    </el-button>
  </form>
</div>

</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import axios from '@/config/axios'
import { ElNotification } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { useCartStore } from '@/stores/cart'

const authStore = useAuthStore()
const route = useRoute()
const product = ref(null)
const reviews = ref([])
const loading = ref(true)
const imageError = ref(false)
const cartStore = useCartStore()

const loadReviews = async () => {
  try {
    const response = await axios.get(`/products/${route.params.id}/reviews`)
    reviews.value = response.data
  } catch (error) {
    console.error('Error al cargar reseñas:', error)
  }
}

onMounted(async () => {
  try {
    const response = await axios.get(`/products/${route.params.id}`)
    product.value = response.data
  } catch (error) {
    console.error('Error cargando el producto:', error)
    ElNotification({
      title: 'Error',
      message: 'No se pudo cargar el producto',
      type: 'error'
    })
  } finally {
    loading.value = false
  }

  
await loadReviews()

})



const productImage = computed(() => {
  if (imageError.value || !product.value?.image) {
    return '/placeholder-product.webp'
  }
  return product.value.image.startsWith('http')
    ? product.value.image
    : `/storage/${product.value.image}`
})

const handleImageError = () => {
  imageError.value = true
}

const formatPrice = (price) => {
  return Number(price).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

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


const newReview = ref({
  user_id: 1, 
  comment: '',
  rating: ''
})

const submitReview = async () => {
  try {
    await axios.post(`/products/${route.params.id}/reviews`, newReview.value)
    ElNotification({
      title: 'Gracias por tu reseña',
      message: 'Tu comentario fue enviado correctamente.',
      type: 'success'
    })
    newReview.value.comment = ''
    newReview.value.rating = ''
    await loadReviews()
  } catch (error) {
    console.error('Error al enviar la reseña:', error)
    ElNotification({
      title: 'Error',
      message: 'Hubo un problema al enviar tu reseña.',
      type: 'error'
    })
  }
}

</script> 

<style scoped>
:deep(.gamer-notification) {
  background: #1e293b;
  border: 1px solid #f59e0b;
  color: white;
}
</style>
