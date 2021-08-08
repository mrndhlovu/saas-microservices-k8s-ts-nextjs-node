declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production" | "testing"
      PORT: string
      SEND_GRID_SECRET_KEY: string
      EMAIL_MONGO_URI: string
      NATS_URL: string
      NATS_CLIENT_ID: string
      NATS_CLUSTER_ID: string
    }
  }
}
