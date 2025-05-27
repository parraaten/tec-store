<template>
    <footer class="bg-gray-900 border-t border-orange-900/30 mt-auto">
      <div class="container mx-auto px-4 py-8">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <!-- Logo y derechos -->
          <div class="mb-4 md:mb-0">
            <router-link to="/" class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-400">
              Tec-Store
            </router-link>
          </div>
          
          <!-- Derechos -->
          <div class="text-gray-500 text-sm">
            © {{ new Date().getFullYear() }} Tec-Store.
            <router-link to="/terms">
              Términos y condiciones
            </router-link>
          </div>
        </div>
      </div>
    </footer>
  </template>