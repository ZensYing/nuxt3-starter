<!-- pages/checkout.vue -->
<script setup lang="ts">
import { computed, ref } from 'vue'

// Mock cart data
const cartItems = ref([
  { name: 'Product 1', price: 29.99, quantity: 1 },
  { name: 'Product 2', price: 19.99, quantity: 2 },
])

const orderId = ref(`ORD-${Date.now().toString().slice(-6)}`)
const selectedPayment = ref('bakong')
const showSuccessModal = ref(false)

// Calculate totals
const subtotal = computed(() => {
  return cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0)
})

const shipping = ref(5.00)

const total = computed(() => {
  return subtotal.value + shipping.value
})

// Handle payment events
function handlePaymentSuccess(paymentInfo: any) {
  console.log('Payment successful:', paymentInfo)
  showSuccessModal.value = true

  // In a real app, you would:
  // 1. Update the order status in your database
  // 2. Send confirmation emails
  // 3. Redirect to order confirmation page
}

function handlePaymentFailed(paymentInfo: any) {
  console.log('Payment failed:', paymentInfo)
  // In a real app, you might show more detailed error information
  // or suggest alternative payment methods
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-800 mb-6">
        Checkout
      </h1>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Order Summary Section -->
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">
            Order Summary
          </h2>

          <div class="border-b border-gray-200 pb-4 mb-4">
            <div v-for="(item, index) in cartItems" :key="index" class="flex justify-between mb-2">
              <span>{{ item.name }} x {{ item.quantity }}</span>
              <span>${{ (item.price * item.quantity).toFixed(2) }}</span>
            </div>
          </div>

          <div class="flex justify-between font-semibold mb-2">
            <span>Subtotal</span>
            <span>${{ subtotal.toFixed(2) }}</span>
          </div>

          <div class="flex justify-between text-sm text-gray-600 mb-2">
            <span>Shipping</span>
            <span>${{ shipping.toFixed(2) }}</span>
          </div>

          <div class="flex justify-between font-bold text-lg mt-4">
            <span>Total</span>
            <span>${{ total.toFixed(2) }}</span>
          </div>

          <div class="mt-6">
            <h3 class="text-sm font-medium text-gray-700 mb-2">
              Order ID
            </h3>
            <p class="text-sm text-gray-600">
              {{ orderId }}
            </p>
          </div>
        </div>

        <!-- Payment Section -->
        <div>
          <div class="bg-gray-100 p-4 rounded-lg mb-6">
            <h2 class="text-xl font-semibold text-gray-800 mb-2">
              Payment Method
            </h2>
            <div class="flex space-x-4">
              <button
                class="flex-1 p-3 rounded-lg border-2"
                :class="selectedPayment === 'bakong' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'"
                @click="selectedPayment = 'bakong'"
              />
              <button
                class="flex-1 p-3 rounded-lg border-2"
                :class="selectedPayment === 'card' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'"
                disabled
                @click="selectedPayment = 'card'"
              >
                <div class="text-center text-gray-400">
                  Credit Card
                </div>
                <div class="text-xs text-center text-gray-400">
                  (Coming Soon)
                </div>
              </button>
            </div>
          </div>

          <BakongPayment
            v-if="selectedPayment === 'bakong'"
            :order-reference="orderId"
            :default-amount="total"
            @payment-success="handlePaymentSuccess"
            @payment-failed="handlePaymentFailed"
          />
        </div>
      </div>

      <!-- Payment Success Modal -->
      <div v-if="showSuccessModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
          <div class="text-center">
            <svg class="w-16 h-16 text-green-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 class="text-xl font-bold text-gray-900 mb-2">
              Payment Complete!
            </h3>
            <p class="text-gray-600 mb-6">
              Your order has been successfully placed.
            </p>
            <NuxtLink to="/" class="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5">
              Continue Shopping
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
