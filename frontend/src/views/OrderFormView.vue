<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '../utils/api'

const router = useRouter()
const route = useRoute()
const isLoading = ref(false)
const errorMsg = ref('')

const isEditMode = computed(() => !!route.params.id)
const orderId = computed(() => route.params.id as string)

// Form state
const date = ref(new Date().toISOString().slice(0, 10))
const accountName = ref('')
const customerName = ref('')
const selectedSets = ref<string[]>([])
const productName = ref('')
const quantity = ref(1)
const cost = ref(0)
const sellingPrice = ref(0)
const trackingNumber = ref('')
const orderNumber = ref('')
const platform = ref('Tiktok')

// Options
const setOptions = ['Hottie Set', 'Zaab Set', 'Songkran Set', 'Summer Set', 'Mini Set','Sunny Set','Lovely Set','Bowie Set']
const platformOptions = ['Tiktok', 'Shopee']

// Auto calculations
const revenue = computed(() => quantity.value * sellingPrice.value)
const profit = computed(() => revenue.value - (quantity.value * cost.value))

onMounted(async () => {
  if (isEditMode.value) {
    isLoading.value = true
    try {
      const res = await api.get(`/orders/${orderId.value}`)
      const order = res.data
      
      // Populate form
      date.value = new Date(order.date).toISOString().slice(0, 10)
      accountName.value = order.account_name
      customerName.value = order.customer_name
      
      try {
        selectedSets.value = typeof order.set_name === 'string' ? JSON.parse(order.set_name) : order.set_name
      } catch (e) {
        selectedSets.value = []
      }
      
      productName.value = order.product_name
      quantity.value = order.quantity
      cost.value = order.cost
      sellingPrice.value = order.selling_price
      trackingNumber.value = order.tracking_number || ''
      orderNumber.value = order.order_number || ''
      platform.value = order.platform
    } catch (error) {
      console.error(error)
      errorMsg.value = 'Failed to load order data'
    } finally {
      isLoading.value = false
    }
  }
})

const submitOrder = async () => {
  if (selectedSets.value.length === 0) {
    errorMsg.value = 'Please select at least one Set'
    return
  }

  isLoading.value = true
  errorMsg.value = ''

  try {
    const payload = {
      date: new Date(date.value).toISOString(),
      account_name: accountName.value,
      customer_name: customerName.value,
      set_name: selectedSets.value,
      product_name: productName.value,
      quantity: quantity.value,
      cost: cost.value,
      selling_price: sellingPrice.value,
      revenue: revenue.value,
      profit: profit.value,
      tracking_number: trackingNumber.value,
      order_number: orderNumber.value,
      platform: platform.value
    }
    
    if (isEditMode.value) {
      await api.put(`/orders/${orderId.value}`, payload)
    } else {
      await api.post('/orders', payload)
    }
    
    router.push('/orders')
  } catch (error) {
    console.error(error)
    errorMsg.value = 'Failed to submit order. Please check inputs or try again.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="p-8 pb-20 max-w-5xl mx-auto">
    <div class="flex items-center mb-8 space-x-4">
      <button @click="$router.push('/orders')" class="p-2 bg-white rounded-full soft-shadow hover:bg-gray-50 transition-colors cursor-pointer">
        <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
      </button>
      <h2 class="text-3xl font-bold text-gray-800 tracking-tight">{{ isEditMode ? 'Edit Order Entry' : 'New Order Entry' }}</h2>
    </div>

    <form @submit.prevent="submitOrder" class="bg-white p-8 rounded-2xl soft-shadow border border-gray-100 space-y-8">
      
      <!-- General Info -->
      <div>
        <h3 class="text-lg font-bold text-gray-800 border-b pb-2 mb-4">General Information</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-700">Date</label>
            <input v-model="date" type="date" required class="form-input w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"/>
          </div>
          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-700">Platform</label>
            <select v-model="platform" required class="form-select w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 bg-white">
              <option v-for="opt in platformOptions" :key="opt" :value="opt">{{ opt }}</option>
            </select>
          </div>
          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-700">Account Customer Name</label>
            <input v-model="accountName" type="text" required class="form-input w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500" placeholder="Store Account"/>
          </div>
        </div>
      </div>

      <!-- Customer & Order -->
      <div>
        <h3 class="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Customer & Order Details</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-700">Customer Name</label>
            <input v-model="customerName" type="text" required class="form-input w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500" placeholder="John Doe"/>
          </div>
          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-700">Order Number</label>
            <input v-model="orderNumber" type="text" class="form-input w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500" placeholder="#12345"/>
          </div>
          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-700">Tracking Number</label>
            <input v-model="trackingNumber" type="text" class="form-input w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500" placeholder="TH123..."/>
          </div>
        </div>
      </div>

      <!-- Product & Sets -->
      <div>
        <h3 class="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Product & Set Configuration</h3>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div class="space-y-4">
            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700">Product Name</label>
              <input v-model="productName" type="text" required class="form-input w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500" placeholder="Product XYZ"/>
            </div>
            
            <div class="space-y-2 pt-2">
              <label class="block text-sm font-medium text-gray-700">Set Checklist (Multiple Select)</label>
              <div class="grid grid-cols-2 gap-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <label v-for="set in setOptions" :key="set" class="flex items-center space-x-3 cursor-pointer">
                  <input type="checkbox" :value="set" v-model="selectedSets" class="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500" />
                  <span class="text-gray-700 font-medium text-sm">{{ set }}</span>
                </label>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 h-max">
            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700">Quantity</label>
              <input v-model.number="quantity" type="number" min="1" required class="form-input w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"/>
            </div>
            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700">Fund</label>
              <div class="relative">
                <span class="absolute left-3 top-2.5 text-gray-500">฿</span>
                <input v-model.number="cost" type="number" min="0" step="0.01" required class="form-input w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"/>
              </div>
            </div>
            <div class="space-y-1 col-span-2">
              <label class="block text-sm font-medium text-gray-700">Net Price</label>
              <div class="relative">
                <span class="absolute left-3 top-2.5 text-gray-500">฿</span>
                <input v-model.number="sellingPrice" type="number" min="0" step="0.01" required class="form-input w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"/>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Calculations (Readonly) -->
      <div class="bg-indigo-50 p-6 rounded-xl border border-indigo-100 flex flex-col sm:flex-row gap-6 justify-between items-center">
        <div>
          <h4 class="text-sm font-bold text-indigo-800 uppercase tracking-wider">Calculated Revenue</h4>
          <p class="text-3xl font-extrabold text-indigo-600 mt-1">฿{{ revenue.toLocaleString('en-US', {minimumFractionDigits: 2}) }}</p>
        </div>
        <div>
          <h4 class="text-sm font-bold text-indigo-800 uppercase tracking-wider">Calculated Profit</h4>
          <p class="text-3xl font-extrabold text-pink-600 mt-1">฿{{ profit.toLocaleString('en-US', {minimumFractionDigits: 2}) }}</p>
        </div>
      </div>

      <div v-if="errorMsg" class="text-red-600 bg-red-50 p-3 rounded-lg text-sm font-medium">
        {{ errorMsg }}
      </div>

      <div class="flex justify-end pt-4 border-t border-gray-100 space-x-4">
        <button type="button" @click="$router.push('/orders')" class="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors cursor-pointer">
          Cancel
        </button>
        <button type="submit" :disabled="isLoading" class="px-8 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer flex items-center">
          <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ isLoading ? 'Saving...' : (isEditMode ? 'Update Order' : 'Save Order') }}
        </button>
      </div>
    </form>
  </div>
</template>
