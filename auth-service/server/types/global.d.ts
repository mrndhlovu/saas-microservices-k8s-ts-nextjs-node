declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production" | "testing"
      PORT: string
      JWT_TOKEN_SIGNATURE: string
      JWT_REFRESH_TOKEN_SIGNATURE: string
      AUTH_MONGO_URI: string
    }
  }
}
