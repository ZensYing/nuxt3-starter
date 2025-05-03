<!-- components/BakongPayment.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import useBakong from '~/composables/useBakong'

const props = defineProps({
  orderReference: {
    type: String,
    default: () => `ORDER-${Date.now()}`,
  },
  defaultAmount: {
    type: Number,
    default: 10.00,
  },
})

const emit = defineEmits(['payment-success', 'payment-failed'])

const amount = ref(props.defaultAmount)
const description = ref('')

const {
  startPayment,
  checkPayment,
  isLoading,
  paymentStatus,
  paymentDetails,
} = useBakong()

async function handleSubmit() {
  if (amount.value <= 0)
    return

  await startPayment(
    amount.value,
    props.orderReference,
    description.value,
  )

  // In a real app, you might want to poll for payment status
  // or rely on webhook notifications
}

async function verifyPayment() {
  if (!paymentDetails.paymentId)
    return

  const success = await checkPayment(paymentDetails.paymentId)

  if (success) {
    emit('payment-success', {
      amount: amount.value,
      paymentId: paymentDetails.paymentId,
      orderReference: props.orderReference,
    })
  }
  else {
    emit('payment-failed', {
      paymentId: paymentDetails.paymentId,
      orderReference: props.orderReference,
    })
  }
}

function resetPayment() {
  paymentStatus.value = 'idle'
  amount.value = props.defaultAmount
  description.value = ''
}
</script>

<template>
  <div class="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
    <div class="flex items-center mb-6">
      <img src="" alt="Bakong Logo" class="h-10 mr-3">
      <h2 class="text-2xl font-semibold text-gray-800">
        Bakong Payment
      </h2>
    </div>

    <!-- Payment Form -->
    <div v-if="paymentStatus === 'idle'">
      <form class="space-y-4" @submit.prevent="handleSubmit">
        <div>
          <label for="amount" class="block mb-2 text-sm font-medium text-gray-700">Amount (USD)</label>
          <input
            id="amount"
            v-model="amount"
            type="number"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            min="0.01"
            step="0.01"
            required
          >
        </div>

        <div>
          <label for="description" class="block mb-2 text-sm font-medium text-gray-700">Description (Optional)</label>
          <input
            id="description"
            v-model="description"
            type="text"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
        </div>

        <button
          type="submit"
          class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          :disabled="isLoading"
        >
          <span v-if="isLoading">
            <svg class="inline w-4 h-4 mr-2 text-gray-200 animate-spin fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
            </svg>
            Processing...
          </span>
          <span v-else>Pay with Bakong</span>
        </button>
      </form>
    </div>

    <!-- Payment Processing -->
    <div v-else-if="paymentStatus === 'pending'" class="text-center">
      <div v-if="paymentDetails.qrCode" class="mb-6">
        <h3 class="text-lg font-medium text-gray-700 mb-3">
          Scan with Bakong App
        </h3>
        <img :src="paymentDetails.qrCode" alt="Bakong QR Code" class="mx-auto h-48 w-48">
      </div>

      <div v-if="paymentDetails.deepLink" class="mb-6">
        <a
          :href="paymentDetails.deepLink"
          class="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
        >
          <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
          </svg>
          Open Bakong App
        </a>
      </div>

      <p class="text-sm text-gray-600 mb-4">
        Payment ID: {{ paymentDetails.paymentId }}
      </p>

      <div class="flex justify-between">
        <button
          class="text-gray-700 bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5"
          @click="paymentStatus = 'idle'"
        >
          Cancel
        </button>

        <button
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
          :disabled="isLoading"
          @click="verifyPayment"
        >
          <span v-if="isLoading">Checking...</span>
          <span v-else>I've Paid</span>
        </button>
      </div>
    </div>

    <!-- Payment Success -->
    <div v-else-if="paymentStatus === 'success'" class="text-center">
      <div class="bg-green-100 text-green-800 p-4 rounded-lg mb-6">
        <svg class="w-12 h-12 text-green-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="text-lg font-medium">
          Payment Successful!
        </h3>
        <p class="text-sm mt-2">
          Your payment has been processed successfully.
        </p>
        <p class="text-sm mt-1">
          Transaction ID: {{ paymentDetails.paymentId }}
        </p>
      </div>

      <button
        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
        @click="resetPayment"
      >
        Make Another Payment
      </button>
    </div>

    <!-- Payment Failed -->
    <div v-else-if="paymentStatus === 'failed'" class="text-center">
      <div class="bg-red-100 text-red-800 p-4 rounded-lg mb-6">
        <svg class="w-12 h-12 text-red-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="text-lg font-medium">
          Payment Failed
        </h3>
        <p class="text-sm mt-2">
          {{ paymentDetails.errorMessage || 'Unable to process your payment at this time.' }}
        </p>
      </div>

      <button
        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
        @click="resetPayment"
      >
        Try Again
      </button>
    </div>
  </div>
</template>
