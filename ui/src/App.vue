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
        <router-view />
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

