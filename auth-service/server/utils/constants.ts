export const editableUserFields = [
  "firstName",
  "lastName",
  "email",
  "starredBoards",
  "username",
  "avatar",
  "bio",
  "viewedRecent",
  "notifications",
  "multiFactorAuth",
]

export const allowedOrigins = [
  "https://tusks.dev",
  "http://tusks.dev",
  "http://localhost:5000",
  "http://127.0.0.1:5555",
  "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
]

export const USER_EXCLUDED_OPTIONS = "-refreshTokens -accessTokens -mfaTokens"

export const BOARDS_QUEUE_GROUP_NAME = "boards-service"

export const DEFAULT_EMAIL = "kandhlovuie@gmail.com"

export const SECURITY_QUESTIONS = {
  color: "What is your favorite color?",
  friendName: "What is the name of your best friend?",
  petName: "What is the name of your favorite pet?",
}

export const BASE_URL = "https://tusks.dev"
export const DID_NOT_UPDATE_PASSWORD_ENDPOINT = `${BASE_URL}/api/auth/pause-account`
export const RESTORE_ACCOUNT_ENDPOINT = `${BASE_URL}/auth/restore-account`
export const LOGIN_ENDPOINT = `${BASE_URL}/api/auth/login`
