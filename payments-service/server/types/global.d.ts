declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production" | "testing"
      PORT: string
      JWT_TOKEN_SIGNATURE: string
      JWT_REFRESH_TOKEN_SIGNATURE: string
      STRIPE_PUBLISHABLE_KEY: string
      STRIPE_SECRET_KEY: string
      PAYMENTS_MONGO_URI: string
      NATS_URL: string
      NATS_CLIENT_ID: string
      NATS_CLUSTER_ID: string
    }
  }
}
