<script setup lang="ts">
import { useAuthStore } from './stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen flex flex-col md:flex-row bg-gray-50 text-gray-800 font-sans">
    <!-- Sidebar / Topbar for Authenticated Users -->
    <nav v-if="authStore.isAuthenticated" class="w-full md:w-64 bg-white border-r border-gray-200 shrink-0 flex flex-col soft-shadow z-10 transition-all duration-300">
      <div class="p-6">
        <h1 class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 tracking-tight">Richie's Shop</h1>
      </div>
      <div class="flex-1 overflow-y-auto w-full">
        <ul class="space-y-2 p-4">
          <li>
            <router-link to="/" class="block px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors" exact-active-class="bg-purple-50 text-purple-700">Dashboard</router-link>
          </li>
          <li>
            <router-link to="/orders/new" class="block px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors" exact-active-class="bg-purple-50 text-purple-700">New Order</router-link>
          </li>
          <li>
            <router-link to="/orders" class="block px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors" exact-active-class="bg-purple-50 text-purple-700">Order List</router-link>
          </li>
        </ul>
      </div>
      <div class="p-4 border-t border-gray-200 mt-auto">
        <p class="text-sm text-gray-500 mb-2 truncate">Logged in as <span class="font-bold text-gray-700">{{ authStore.user }}</span></p>
        <button @click="logout" class="w-full px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors cursor-pointer">
          Logout
        </button>
      </div>
    </nav>

    <!-- Main Content Area -->
    <main :class="['flex-1 overflow-x-hidden relative h-screen transition-all', authStore.isAuthenticated ? '' : 'flex items-center justify-center bg-gray-50']">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<style scoped>
/* Optional component specific styling */
</style>
