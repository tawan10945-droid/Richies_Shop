<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '../utils/api'

interface DashboardData {
  totalOrders: number;
  totalSales: number;
  totalProfit: number;
  tiktok: { sales: number, profit: number, count: number };
  shopee: { sales: number, profit: number, count: number };
}

const data = ref<DashboardData | null>(null)
const isLoading = ref(true)

onMounted(async () => {
  try {
    const res = await api.get('/dashboard')
    data.value = res.data
  } catch (error) {
    console.error('Failed to load dashboard', error)
  } finally {
    isLoading.value = false
  }
})

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(val)
}
</script>

<template>
  <div class="p-8 pb-20">
    <div class="flex justify-between items-center mb-8">
      <h2 class="text-3xl font-bold text-gray-800 tracking-tight">Dashboard Overview</h2>
      <button @click="$router.push('/orders/new')" class="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-medium rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer">
        + New Order
      </button>
    </div>

    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
    </div>

    <div v-else-if="data" class="space-y-8">
      <!-- Total Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-2xl soft-shadow border border-gray-100 flex flex-col hover:shadow-lg transition-all">
          <span class="text-gray-500 text-sm font-medium">Total Orders</span>
          <span class="text-3xl font-bold mt-2 text-gray-800">{{ data.totalOrders }}</span>
        </div>
        <div class="bg-white p-6 rounded-2xl soft-shadow border border-gray-100 flex flex-col hover:shadow-lg transition-all relative overflow-hidden">
          <div class="absolute -right-6 -top-6 w-24 h-24 bg-green-50 rounded-full opacity-50"></div>
          <span class="text-gray-500 text-sm font-medium relative z-10">Total Revenue</span>
          <span class="text-3xl font-bold mt-2 text-green-600 relative z-10">{{ formatCurrency(data.totalSales) }}</span>
        </div>
        <div class="bg-white p-6 rounded-2xl soft-shadow border border-gray-100 flex flex-col hover:shadow-lg transition-all relative overflow-hidden">
          <div class="absolute -right-6 -top-6 w-24 h-24 bg-purple-50 rounded-full opacity-50"></div>
          <span class="text-gray-500 text-sm font-medium relative z-10">Total Profit</span>
          <span class="text-3xl font-bold mt-2 text-purple-600 relative z-10">{{ formatCurrency(data.totalProfit) }}</span>
        </div>
      </div>

      <!-- Platform Comparison -->
      <h3 class="text-xl font-bold text-gray-800 mt-10 mb-4 tracking-tight">Platform Performance</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <!-- TikTok -->
        <div class="bg-white rounded-2xl soft-shadow border border-gray-100 overflow-hidden hover:shadow-lg transition-all">
          <div class="bg-black p-4 text-white flex items-center">
            <svg class="h-6 w-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93v7.2c0 1.96-.54 3.94-1.6 5.56-1.57 2.4-4.28 3.52-7.1 2.87-3.08-.7-5.1-3.6-5.11-6.73-.01-1.85.73-3.7 2.05-5.01 1.78-1.78 4.39-2.34 6.74-1.39v4.06c-1.02-.32-2.18-.11-2.95.69-.97.99-1.04 2.76-.14 3.82 1.05 1.25 3.09 1.18 4.04-.15.42-.6.63-1.36.63-2.1v-16.9z" />
            </svg>
            <h4 class="text-lg font-bold">TikTok Shop</h4>
          </div>
          <div class="p-6 space-y-4">
            <div class="flex justify-between items-end border-b border-gray-100 pb-3">
              <span class="text-gray-500 font-medium">Orders</span>
              <span class="text-2xl font-bold text-gray-800">{{ data.tiktok.count }}</span>
            </div>
            <div class="flex justify-between items-end border-b border-gray-100 pb-3">
              <span class="text-gray-500 font-medium">Revenue</span>
              <span class="text-xl font-bold text-green-600">{{ formatCurrency(data.tiktok.sales) }}</span>
            </div>
            <div class="flex justify-between items-end">
              <span class="text-gray-500 font-medium">Profit</span>
              <span class="text-xl font-bold text-purple-600">{{ formatCurrency(data.tiktok.profit) }}</span>
            </div>
          </div>
        </div>

        <!-- Shopee -->
        <div class="bg-white rounded-2xl soft-shadow border border-gray-100 overflow-hidden hover:shadow-lg transition-all">
          <div class="bg-orange-500 p-4 text-white flex items-center">
            <svg class="h-6 w-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/>
            </svg>
            <h4 class="text-lg font-bold">Shopee</h4>
          </div>
          <div class="p-6 space-y-4">
            <div class="flex justify-between items-end border-b border-gray-100 pb-3">
              <span class="text-gray-500 font-medium">Orders</span>
              <span class="text-2xl font-bold text-gray-800">{{ data.shopee.count }}</span>
            </div>
            <div class="flex justify-between items-end border-b border-gray-100 pb-3">
              <span class="text-gray-500 font-medium">Revenue</span>
              <span class="text-xl font-bold text-green-600">{{ formatCurrency(data.shopee.sales) }}</span>
            </div>
            <div class="flex justify-between items-end">
              <span class="text-gray-500 font-medium">Profit</span>
              <span class="text-xl font-bold text-purple-600">{{ formatCurrency(data.shopee.profit) }}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
