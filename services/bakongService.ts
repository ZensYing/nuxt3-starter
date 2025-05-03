// bakongService.ts - Core functionality for Bakong payment gateway
import { reactive, ref } from 'vue'

interface BakongConfig {
  apiEndpoint: string
  merchantId: string
  token: string
  expiryDate: Date
}

interface PaymentRequest {
  amount: number
  currency: string
  orderId: string
  description?: string
  returnUrl?: string
  notifyUrl?: string
}

interface PaymentResponse {
  success: boolean
  paymentId?: string
  deepLink?: string
  qrCode?: string
  errorMessage?: string
}

export default class BakongService {
  private config: BakongConfig
  public isLoading = ref(false)
  public lastResponse = reactive<PaymentResponse>({
    success: false,
  })

  constructor(config: BakongConfig) {
    this.config = config
  }

  public async initiatePayment(paymentData: PaymentRequest): Promise<PaymentResponse> {
    this.isLoading.value = true

    try {
      // Simulate API call to Bakong
      // In production, replace with actual API call
      console.log(`Initiating payment to ${this.config.apiEndpoint}`)

      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Mock successful response
      const response: PaymentResponse = {
        success: true,
        paymentId: `BKNG-${Date.now()}`,
        deepLink: `bakong://pay?invoice=${paymentData.orderId}&amount=${paymentData.amount}`,
        qrCode: `https://api.qrserver.com/v1/create-qr-code/?data=bakong://pay?invoice=${paymentData.orderId}&amount=${paymentData.amount}&size=200x200`,
      }

      this.lastResponse = reactive(response)
      return response
    }
    catch (error) {
      const errorResponse: PaymentResponse = {
        success: false,
        errorMessage: error instanceof Error ? error.message : 'Unknown error occurred',
      }
      this.lastResponse = reactive(errorResponse)
      return errorResponse
    }
    finally {
      this.isLoading.value = false
    }
  }

  public async checkPaymentStatus(paymentId: string): Promise<boolean> {
    this.isLoading.value = true

    try {
      // Simulate API call to check payment status
      console.log(`Checking payment status for ${paymentId}`)

      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Mock payment status (80% chance of success for demo)
      const isSuccessful = Math.random() > 0.2

      return isSuccessful
    }
    catch (error) {
      console.error('Error checking payment status:', error)
      return false
    }
    finally {
      this.isLoading.value = false
    }
  }

  public validateToken(): boolean {
    const now = new Date()
    return now < this.config.expiryDate
  }
}
