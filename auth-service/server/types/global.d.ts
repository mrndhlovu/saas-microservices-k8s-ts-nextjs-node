declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production" | "testing"
      PORT: string
      JWT_TOKEN_SIGNATURE: string
      JWT_REFRESH_TOKEN_SIGNATURE: string
      MONGO_URI: string
    }
  }
}
