<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import 'dotenv/config';

const router = useRouter()
const authStore = useAuthStore()

const username = ref(import.meta.env.VITE_DEV_USERNAME || '')
const password = ref(import.meta.env.VITE_DEV_PASSWORD || '')
const errorMsg = ref('')
const isLoading = ref(false)

const handleLogin = async () => {
  errorMsg.value = ''
  isLoading.value = true
  const success = await authStore.login(username.value, password.value)
  isLoading.value = false
  if (success) {
    router.push('/')
  } else {
    errorMsg.value = 'Invalid username or password'
  }
}
</script>

<template>
  <div class="h-full w-full flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
    <div class="w-full max-w-md p-8 glass rounded-2xl soft-shadow text-center">
      <div class="mb-8">
        <h1 class="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 tracking-tight">Richie'z shop</h1>
        <p class="text-sm text-gray-500 mt-2">Welcome back! Please login to your account.</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div class="space-y-1 text-left">
          <label class="block text-sm font-medium text-gray-700">Username</label>
          <input
            v-model="username"
            type="text"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
            placeholder="Enter your username"
          />
        </div>

        <div class="space-y-1 text-left">
          <label class="block text-sm font-medium text-gray-700">Password</label>
          <input
            v-model="password"
            type="password"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
            placeholder="••••••••"
          />
        </div>

        <div v-if="errorMsg" class="text-sm text-red-500 text-left bg-red-50 px-3 py-2 rounded">
          {{ errorMsg }}
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 transition-all cursor-pointer"
        >
          <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ isLoading ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>
    </div>
  </div>
</template>
