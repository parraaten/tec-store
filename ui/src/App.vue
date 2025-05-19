<template>
  <div class="min-h-screen flex flex-col bg-gray-900">
    <!-- Navbar con estilo gamer -->
    <Navbar class="z-50" />

    <!-- Contenido principal con efecto de neón -->
    <main class="flex-grow relative overflow-hidden">
      <!-- Efectos de luces de fondo -->
      <div class="absolute inset-0 overflow-hidden">
        <div
          class="absolute top-0 left-1/4 w-32 h-32 bg-purple-600 rounded-full filter blur-3xl opacity-20 animate-pulse">
        </div>
        <div
          class="absolute bottom-0 right-1/4 w-48 h-48 bg-blue-600 rounded-full filter blur-3xl opacity-20 animate-pulse animation-delay-2000">
        </div>
        <div
          class="absolute top-1/3 right-0 w-24 h-24 bg-cyan-500 rounded-full filter blur-3xl opacity-20 animate-pulse animation-delay-3000">
        </div>
      </div>

      <!-- Contenido del router con contenedor estilizado -->
      <div class="relative z-10">
        <router-view class="min-h-[calc(100vh-8rem)]" />
      </div>
    </main>

    <!-- Footer con estilo gamer -->
    <Footer class="z-50" />
  </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
</script>

<style>
/* Estilos globales */
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: 'Rajdhani', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Animaciones personalizadas */
@keyframes pulse {

  0%,
  100% {
    opacity: 0.2;
  }

  50% {
    opacity: 0.4;
  }
}

.animate-pulse {
  animation: pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-3000 {
  animation-delay: 3s;
}

/* Scrollbar personalizada */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #1a1a2e;
}

::-webkit-scrollbar-thumb {
  background: #6c5ce7;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #5649c0;
}

/* Transiciones para las páginas */
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>