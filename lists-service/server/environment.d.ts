declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production" | "testing"
      PORT: string
      TOKEN_SIGNATURE: string
      REFRESH_TOKEN_SIGNATURE: string
      BOARD_TOKEN_SIGNATURE: string
      MONGO_DB_URI: string
    }
  }
}

export {}
