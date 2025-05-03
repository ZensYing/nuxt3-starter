// plugins/bakong.ts
import { defineNuxtPlugin } from '#app'
import BakongService from '~/services/bakongService'

export default defineNuxtPlugin((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig()

  // Initialize Bakong service with configuration
  const bakongService = new BakongService({
    apiEndpoint: (runtimeConfig.public.bakongApiEndpoint as string) || 'https://api.bakong.nbc.gov.kh/v1/payments',
    merchantId: runtimeConfig.public.bakongMerchantId || 'demo-merchant',
    token: runtimeConfig.public.bakongToken || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoiYWIwMGZkODVkMzYzNDFmNiJ9LCJpYXQiOjE3NDYyODk2MzQsImV4cCI6MTc1NDA2NTYzNH0.4rECPlYDDLQH5GltdhC1VC8Jql_TiZuGoj508CWEjOo',
    expiryDate: new Date(runtimeConfig.public.bakongTokenExpiry || '2025-08-01'),
  })

  // Make available in Nuxt app
  nuxtApp.provide('bakong', bakongService)
})
