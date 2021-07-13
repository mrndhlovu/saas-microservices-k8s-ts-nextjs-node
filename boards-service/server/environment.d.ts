declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production"
      PORT: string
      BOARD_TOKEN_SIGNATURE: string
      MONGO_DB_URI: string
    }
  }
}

export {}
