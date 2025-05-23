<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <!-- Encabezado -->
      <div class="text-center my-6">
        <h2 class="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-400">PAGO CON PAYPAL</h2>
        <p class="text-gray-400">Completa tu compra de forma segura</p>
      </div>

      <!-- Resumen del pedido -->
      <div class="bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
        <h3 class="text-xl font-semibold text-white mb-4">RESUMEN DEL PEDIDO</h3>
        
        <div class="space-y-3 mb-6">
          <div class="flex justify-between text-gray-300">
            <span>Total ({{ cartStore.itemCount }} items)</span>
            <span class="text-orange-400 font-bold text-lg">${{ formatPrice(cartStore.total) }}</span>
          </div>
        </div>

        <!-- Contenedor de PayPal -->
        <div id="paypal-button-container" ref="paypalButtonContainer" class="paypal-container"></div>
      </div>

      <div class="text-center">
        <router-link 
          to="/cart" 
          class="inline-flex items-center p-2 text-gray-400 hover:text-orange-400 transition-colors"
        >
          <el-icon><ArrowLeft /></el-icon>
          <span class="ml-2">Volver al carrito</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useCartStore } from '@/stores/cart'
import { ElNotification } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'

const cartStore = useCartStore()
const paypalButtonContainer = ref(null)
let paypalButtons = null

const formatPrice = (price) => {
  return Number(price).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

const loadPayPalScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = `https://www.paypal.com/sdk/js?client-id=${import.meta.env.VUE_APP_PAYPAL_CLIENT_ID || 'sb'}&currency=MXN`
    script.addEventListener('load', resolve)
    document.body.appendChild(script)
  })
}

const setupPayPalButtons = async () => {
  await loadPayPalScript()
  
  if (!window.paypal) {
    console.error('PayPal SDK no se cargó correctamente')
    return
  }

  paypalButtons = window.paypal.Buttons({
    style: {
      layout: 'vertical',
      color: 'gold',
      shape: 'rect',
      label: 'pay'
    },
    createOrder: (data, actions) => {
      return actions.order.create({
        purchase_units: [{
          amount: {
            value: cartStore.total.toFixed(2),
            currency_code: 'MXN',
            breakdown: {
              item_total: {
                currency_code: 'MXN',
                value: cartStore.total.toFixed(2)
              }
            }
          },
          items: cartStore.items.map(item => ({
            name: item.name.substring(0, 127), // PayPal limita a 127 caracteres
            unit_amount: {
              currency_code: 'MXN',
              value: item.price
            },
            quantity: item.quantity.toString(),
            category: 'PHYSICAL_GOODS'
          }))
        }]
      })
    },
    onApprove: async (data, actions) => {
      try {
        const order = await actions.order.capture()
        
        ElNotification({
          title: 'Pago completado',
          message: `Tu pago fue procesado con éxito. ID: ${order.id}`,
          type: 'success',
          duration: 10000
        })
        
        cartStore.clearCart()
      } catch (error) {
        ElNotification({
          title: 'Error en el pago',
          message: 'Hubo un problema al procesar tu pago',
          type: 'error'
        })
        console.error('Error al capturar el pago:', error)
      }
    },
    onError: (error) => {
      ElNotification({
        title: 'Error en PayPal',
        message: error.message || 'Ocurrió un error con PayPal',
        type: 'error'
      })
      console.error('Error PayPal:', error)
    }
  })

  if (paypalButtonContainer.value && paypalButtons) {
    paypalButtons.render(paypalButtonContainer.value)
  }
}

onMounted(() => {
  setupPayPalButtons()
})

onBeforeUnmount(() => {
  if (paypalButtons) {
    paypalButtons.close()
  }
})
</script>

<style scoped>
.paypal-container {
  max-width: 500px;
  margin: 0 auto;
  min-height: 200px;
}
</style>