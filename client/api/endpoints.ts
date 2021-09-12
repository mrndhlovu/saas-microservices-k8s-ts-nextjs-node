const END_POINTS = {
  accounts: "/accounts",
  board: "/board",
  boards: "/boards",
  createBoard: "/boards/create",

  lists: "/lists",

  cards: "/cards",

  connectMfa: "/auth/mfa/connect",
  currentUser: "/auth/me",
  deleteUser: "/auth/delete",
  enableMfa: "/auth/mfa/enable",
  getQrCodeImage: "/auth/mfa/qr-code",
  login: "/auth/login",
  logout: "/auth/logout",
  refreshToken: "/auth/refresh-token",
  requestLink: "/auth/get-verification-link",
  signup: "/auth/signup",
  updateUser: "/auth/update",
  verify: "/accounts/verify",
  verifyCredentials: "/auth/login-verify",
  verifyMfaCode: "/auth/mfa/validate",

  spotify: "/accounts/powerups/spotify",

  payments: "/payments/subscription",
  getBillingOptions: "/payments/products",
  getBillingHistory: "/payments",
}

export default END_POINTS
