<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '../utils/api'
import Swal from 'sweetalert2'

const orders = ref<any[]>([])
const isLoading = ref(true)

const fetchOrders = async () => {
  try {
    const res = await api.get('/orders')
    orders.value = res.data
  } catch (error) {
    console.error('Failed to load orders', error)
  } finally {
    isLoading.value = false
  }
}

const deleteOrder = async (id: number) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#9333ea',
    cancelButtonColor: '#d1d5db',
    confirmButtonText: 'Yes, delete it!'
  })

  if (result.isConfirmed) {
    try {
      await api.delete(`/orders/${id}`)
      await fetchOrders()
      Swal.fire({
        title: 'Deleted!',
        text: 'Your order has been deleted.',
        icon: 'success',
        confirmButtonColor: '#9333ea'
      })
    } catch (error) {
      console.error('Failed to delete order', error)
      Swal.fire({
        title: 'Error!',
        text: 'Error deleting order.',
        icon: 'error',
        confirmButtonColor: '#9333ea'
      })
    }
  }
}

onMounted(() => {
  fetchOrders()
})

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(val)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('th-TH')
}

const parseSetList = (setStr: string | any[]) => {
  if (Array.isArray(setStr)) return setStr.join(', ')
  try {
    return JSON.parse(setStr).join(', ')
  } catch (e) {
    return setStr
  }
}
</script>

<template>
  <div class="p-8 pb-20 max-w-7xl mx-auto">
    <div class="flex justify-between items-center mb-8">
      <h2 class="text-3xl font-bold text-gray-800 tracking-tight">Order Management</h2>
      <button @click="$router.push('/orders/new')" class="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-medium rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer">
        + New Order
      </button>
    </div>

    <div class="bg-white rounded-2xl soft-shadow border border-gray-100 overflow-hidden">
      <div v-if="isLoading" class="p-12 text-center text-gray-500">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
        Loading orders...
      </div>
      
      <div v-else-if="orders.length === 0" class="p-16 text-center text-gray-500">
        <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
        <p class="text-lg">No orders found.</p>
        <button @click="$router.push('/orders/new')" class="mt-4 text-purple-600 hover:text-purple-700 font-medium cursor-pointer">Start by creating one here.</button>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left whitespace-nowrap text-sm">
          <thead>
            <tr class="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider border-b border-gray-200">
              <th class="px-6 py-4 font-semibold rounded-tl-xl">Date</th>
              <th class="px-6 py-4 font-semibold">Platform</th>
              <th class="px-6 py-4 font-semibold">Account / Customer</th>
              <th class="px-6 py-4 font-semibold">Product / Sets</th>
              <th class="px-6 py-4 font-semibold text-right">Revenue</th>
              <th class="px-6 py-4 font-semibold text-right">Profit</th>
              <th class="px-6 py-4 font-semibold text-right rounded-tr-xl">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="order in orders" :key="order.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 font-medium text-gray-900">{{ formatDate(order.date) }}</td>
              <td class="px-6 py-4">
                <span :class="['px-3 py-1 text-xs font-bold rounded-full', 
                  order.platform.toLowerCase() === 'tiktok' ? 'bg-black text-white' : 'bg-orange-100 text-orange-800'
                ]">
                  {{ order.platform }}
                </span>
              </td>
              <td class="px-6 py-4">
                <p class="font-bold text-gray-800">{{ order.account_name }}</p>
                <p class="text-gray-500 text-xs">{{ order.customer_name }}</p>
                <p v-if="order.order_number" class="text-xs font-mono text-purple-600 mt-1">#{{ order.order_number }}</p>
              </td>
              <td class="px-6 py-4">
                <p class="font-medium text-gray-800">{{ order.quantity }}x {{ order.product_name }}</p>
                <p class="text-gray-500 text-xs truncate max-w-xs" :title="parseSetList(order.set_name)">
                  {{ parseSetList(order.set_name) }}
                </p>
              </td>
              <td class="px-6 py-4 text-right font-bold text-green-600">
                {{ formatCurrency(order.revenue) }}
              </td>
              <td class="px-6 py-4 text-right font-bold text-purple-600">
                {{ formatCurrency(order.profit) }}
              </td>
              <td class="px-6 py-4 text-right space-x-2">
                <button @click="$router.push(`/orders/${order.id}/edit`)" class="text-indigo-600 hover:text-indigo-900 font-medium cursor-pointer">Edit</button>
                <button @click="deleteOrder(order.id)" class="text-red-600 hover:text-red-900 font-medium cursor-pointer">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
