import { defineStore } from 'pinia'
import { ElNotification } from 'element-plus'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: []
  }),
  
  actions: {
    addItem(product) {
      const existing = this.items.find(item => item.id === product.id)
      
      if (existing) {
        existing.quantity++
        ElNotification({
          title: 'Cantidad actualizada',
          message: `Ahora tienes ${existing.quantity} ${existing.name} en el carrito`,
          type: 'success',
          position: 'bottom-right',
          duration: 2000
        })
      } else {
        this.items.push({ ...product, quantity: 1 })
        ElNotification({
          title: '¡Añadido!',
          message: `${product.name} fue añadido al carrito`,
          type: 'success',
          position: 'bottom-right',
          duration: 2000
        })
      }
    },
    
    removeItem(productId) {
      this.items = this.items.filter(item => item.id !== productId)
    },
    
    updateQuantity(productId, newQuantity) {
      const item = this.items.find(item => item.id === productId)
      if (item) {
        item.quantity = newQuantity
      }
    },
    
    clearCart() {
      this.items = []
    }
  },
  
  getters: {
    subtotal() {
      return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    },
    
    total() {
      return this.subtotal
    },
    
    itemCount() {
      return this.items.reduce((count, item) => count + item.quantity, 0)
    }
  }
})