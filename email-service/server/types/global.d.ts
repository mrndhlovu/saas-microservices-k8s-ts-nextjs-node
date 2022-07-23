declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production" | "testing"
      PORT: string
      MAILGUN_SECRET_KEY: string
      MONGO_URI: string
      NATS_URL: string
      NATS_CLIENT_ID: string
      NATS_CLUSTER_ID: string
    }
  }
}
