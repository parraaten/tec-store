<template>
    <nav class="bg-gray-900 border-b border-orange-900/30 shadow-lg">
        <div class="container mx-auto px-4">
            <div class="flex items-center justify-between h-16">
                <!-- Logo con efecto -->
                <router-link to="/"
                    class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-400 hover:from-orange-300 hover:to-yellow-300 transition-all duration-300">
                    Tienda Gamer
                </router-link>

                <!-- Menú principal -->
                <div class="flex items-center space-x-6">
                    <router-link to="/"
                        class="px-1 py-2 text-gray-300 hover:text-orange-400 transition-colors duration-300 relative group"
                        :class="{ 'text-orange-400': $route.path === '/' }">
                        Inicio
                        <span
                            class="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-400 transition-all duration-300 group-hover:w-full"
                            :class="{ 'w-full': $route.path === '/' }"></span>
                    </router-link>

                    <router-link to="/cart"
                        class="px-1 py-2 text-gray-300 hover:text-orange-400 transition-colors duration-300 relative group flex items-center"
                        :class="{ 'text-orange-400': $route.path === '/cart' }">
                        <el-icon :size="20" class="pr-1">
                            <ShoppingCart />
                        </el-icon>
                        Carrito
                        <span
                            class="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-400 transition-all duration-300 group-hover:w-full"
                            :class="{ 'w-full': $route.path === '/cart' }"></span>
                    </router-link>

                    <router-link to="/admin"
                        class="px-1 py-2 text-gray-300 hover:text-orange-400 transition-colors duration-300 relative group"
                        :class="{ 'text-orange-400': $route.path.startsWith('/admin') }">
                        Admin
                        <span
                            class="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-400 transition-all duration-300 group-hover:w-full"
                            :class="{ 'w-full': $route.path.startsWith('/admin') }"></span>
                    </router-link>
                </div>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { ShoppingCart } from '@element-plus/icons-vue'
</script>

<style scoped>
a {
    padding: 20px !important;
}
</style>