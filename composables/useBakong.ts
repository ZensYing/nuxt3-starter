// composables/useBakong.ts
import { reactive, ref } from 'vue'
import BakongService from '~/services/bakongService'

export default function useBakong() {
  const bakongConfig = reactive({
    apiEndpoint: 'https://api.bakong.nbc.gov.kh/v1/payments',
    merchantId: process.env.BAKONG_MERCHANT_ID || 'demo-merchant',
    token: process.env.BAKONG_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoiYWIwMGZkODVkMzYzNDFmNiJ9LCJpYXQiOjE3NDYyODk2MzQsImV4cCI6MTc1NDA2NTYzNH0.4rECPlYDDLQH5GltdhC1VC8Jql_TiZuGoj508CWEjOo',
    expiryDate: new Date('2025-08-01'),
  })

  const bakongService = new BakongService(bakongConfig)
  const paymentStatus = ref<'idle' | 'pending' | 'success' | 'failed'>('idle')
  const currentPaymentId = ref<string | null>(null)

  const startPayment = async (amount: number, orderId: string, description?: string) => {
    paymentStatus.value = 'pending'

    const result = await bakongService.initiatePayment({
      amount,
      currency: 'USD', // Default to USD, can be parametrized if needed
      orderId,
      description: description || `Payment for order ${orderId}`,
    })

    if (result.success && result.paymentId) {
      currentPaymentId.value = result.paymentId
      return result
    }
    else {
      paymentStatus.value = 'failed'
      return result
    }
  }

  const checkPayment = async (paymentId?: string) => {
    const idToCheck = paymentId || currentPaymentId.value

    if (!idToCheck) {
      throw new Error('No payment ID provided to check')
    }

    const isSuccess = await bakongService.checkPaymentStatus(idToCheck)
    paymentStatus.value = isSuccess ? 'success' : 'failed'

    return isSuccess
  }

  return {
    startPayment,
    checkPayment,
    isLoading: bakongService.isLoading,
    paymentStatus,
    paymentDetails: bakongService.lastResponse,
  }
}
