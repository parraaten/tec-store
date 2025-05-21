<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <!-- Encabezado con estilo gamer -->
    <div class="max-w-7xl mx-auto text-center my-6">
      <h2 class="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-400">
        CATÁLOGO GAMER
      </h2>
      <p class="text-gray-400 max-w-2xl mx-auto">
        Descubre los mejores productos para llevar tu experiencia de juego al siguiente nivel
      </p>
    </div>

    <!-- Contenido principal -->
    <div class="max-w-7xl mx-auto">
      <div v-if="loading" class="flex justify-center py-20">
        <el-icon :size="60" class="animate-spin text-orange-400"><Loading /></el-icon>
      </div>

      <div v-else  class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <ProductCard 
          v-for="product in products" 
          :key="product.id" 
          :product="product"
          class="transition-transform hover:scale-105 duration-300"
          @click="goToDetail(product.id)" 
        /> 
      </div>

      <!-- Mensaje cuando no hay productos -->
      <div v-if="!loading && products.length === 0" class="text-center py-12">
        <el-icon :size="60" class="text-gray-600 mb-4"><Box /></el-icon>
        <h3 class="text-xl font-semibold text-gray-300 mb-2">No hay productos disponibles</h3>
        <p class="text-gray-500 mb-6">Pronto agregaremos nuevos artículos a nuestro catálogo</p>
        <router-link 
          to="/admin/products" 
          v-if="isAdmin"
          class="inline-flex items-center px-4 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
        >
          <el-icon class="mr-2"><Plus /></el-icon>
          Agregar Productos
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/config/axios'
import ProductCard from '@/components/ProductCard.vue'
import { Loading, Box, Plus } from '@element-plus/icons-vue'
import { ElNotification } from 'element-plus'
import { useRouter } from 'vue-router'
import ProductDetail from './ProductDetail.vue'

const products = ref([])
const loading = ref(true)
const router = useRouter()

const goToDetail = (id) => {
  router.push({name : 'productDetail', params : { id }})
}

onMounted(async () => {
  try {
    const response = await axios.get('/products')
    products.value = response.data
  } catch (error) {
    console.error('Error loading products:', error)
    ElNotification({
      title: 'Error',
      message: 'No se pudieron cargar los productos',
      type: 'error',
      position: 'top-right'
    })
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>

/* Transición suave para las tarjetas */
.grid {
  perspective: 1000px;
}
</style>