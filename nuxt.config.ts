import process from 'node:process'

export default defineNuxtConfig({
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },
  runtimeConfig: {
    databaseUrl: '',
    google: {
      clientId: '',
      clientSecret: '',
    },
    stripe: {
      publishableKey: '',
      secretKey: '',
      webhookSecret: '',
    },
    bakongSecretKey: process.env.BAKONG_SECRET_KEY,

    // Public keys that are exposed to the client
    public: {
      url: '',
      bakongApiEndpoint: process.env.BAKONG_API_ENDPOINT || 'https://api.bakong.nbc.gov.kh/v1/payments',
      bakongMerchantId: process.env.BAKONG_MERCHANT_ID || 'demo-merchant',
      bakongToken: process.env.BAKONG_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoiYWIwMGZkODVkMzYzNDFmNiJ9LCJpYXQiOjE3NDYyODk2MzQsImV4cCI6MTc1NDA2NTYzNH0.4rECPlYDDLQH5GltdhC1VC8Jql_TiZuGoj508CWEjOo',
      bakongTokenExpiry: process.env.BAKONG_TOKEN_EXPIRY || '2025-08-01',
    },
  },
  modules: ['@nuxt/ui', '@formkit/auto-animate/nuxt', '@nuxtjs/plausible'],
  plausible: {
    domain: process.env.PLAUSIBLE_DOMAIN,
    apiHost: process.env.PLAUSIBLE_API_HOST ?? 'https://plausible.io',
    trackLocalhost: true,
  },
})
