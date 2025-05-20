<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <!-- Encabezado -->
      <div class="text-center my-6">
        <h1 class="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-400">TU CARRITO</h1>
        <p class="text-gray-400">Revisa tus productos antes de comprar</p>
      </div>

      <!-- Carrito vacío -->
      <div v-if="cartStore.items.length === 0" class="bg-gray-800 rounded-lg p-8 text-center">
        <h3 class="text-xl font-semibold text-gray-300 mb-2">Tu carrito está vacío</h3>
        <router-link 
          to="/" 
          class="inline-flex items-center p-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
          style="color: white !important;"
        >
          Volver a la tienda
        </router-link>
      </div>

      <!-- Carrito con productos -->
      <div v-else>
        <!-- Lista de productos -->
        <div class="bg-gray-800 rounded-lg overflow-hidden shadow-lg mb-6">
          <div 
            v-for="item in cartStore.items" 
            :key="item.id"
            class="border-b border-gray-700 last:border-b-0 p-4"
          >
            <div class="flex items-start">
              <!-- Imagen del producto -->
              <div class="w-20 h-20 flex-shrink-0 mr-4">
                <img 
                  :src="item.image || '/placeholder-product.webp'"
                  class="w-full h-full object-cover rounded-lg"
                  :alt="item.name"
                >
              </div>

              <!-- Detalles del producto -->
              <div class="flex-grow">
                <div class="flex justify-between">
                  <div>
                    <h3 class="text-lg font-semibold text-white">{{ item.name }}</h3>
                    <p class="text-orange-400 font-bold">${{ formatPrice(item.price) }}</p>
                  </div>
                  <button 
                    @click="cartStore.removeItem(item.id)"
                    class="text-gray-400 hover:text-red-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

                <!-- Selector de cantidad -->
                <div class="mt-2 flex items-center">
                  <button 
                    @click="decreaseQuantity(item)"
                    :disabled="item.quantity <= 1"
                    class="bg-gray-700 text-white px-2 py-1 rounded-l hover:bg-gray-600 disabled:opacity-50"
                  >
                    -
                  </button>
                  
                  <input 
                    type="number" 
                    v-model.number="item.quantity" 
                    @change="updateQuantity(item)"
                    min="1" 
                    :max="item.stock"
                    class="bg-gray-700 text-white text-center w-12 py-1 border-t border-b border-gray-600"
                  >
                  
                  <button 
                    @click="increaseQuantity(item)"
                    :disabled="item.quantity >= item.stock"
                    class="bg-gray-700 text-white px-2 py-1 rounded-r hover:bg-gray-600 disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Resumen del pedido -->
        <div class="bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 class="text-xl font-semibold text-white mb-4 mt-50">RESUMEN DEL PEDIDO</h3>
          
          <div class="space-y-3 mb-6">
            <div class="flex justify-between text-gray-300">
              <span>Total ({{ cartStore.itemCount }} items)</span>
              <span class="text-orange-400 font-bold text-lg">${{ formatPrice(cartStore.total) }}</span>
            </div>
          </div>

          <button 
            @click="checkout"
            class="w-full py-3 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition-colors"
          >
            PROCEDER AL PAGO
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '@/stores/cart'
import { ElNotification } from 'element-plus'

const cartStore = useCartStore()

const formatPrice = (price) => {
  return Number(price).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

const increaseQuantity = (item) => {
  if (item.quantity < item.stock) {
    cartStore.updateQuantity(item.id, item.quantity + 1)
  }
}

const decreaseQuantity = (item) => {
  if (item.quantity > 1) {
    cartStore.updateQuantity(item.id, item.quantity - 1)
  }
}

const updateQuantity = (item) => {
  if (item.quantity < 1) item.quantity = 1
  if (item.quantity > item.stock) item.quantity = item.stock
  cartStore.updateQuantity(item.id, item.quantity)
}

const checkout = () => {
  ElNotification({
    title: 'Compra realizada',
    message: 'Tu pedido ha sido procesado con éxito',
    type: 'success',
    position: 'top-right'
  })
  cartStore.clearCart()
}
</script>

<style scoped>
/* Efecto de neón para el título */
h1 {
  text-shadow: 0 0 8px rgba(251, 146, 60, 0.3);
}
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}
</style>