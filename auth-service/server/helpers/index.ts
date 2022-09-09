import { SignatureType } from "../types"

export const getSignatureKey = (path?: string): SignatureType => {
  const otpPaths = [
    "/update-password",
    "/pause-account",
    "/restore-account",
    "/verify-otp",
    "/restore-account/verify-email",
  ]
  const refreshPaths = ["/refresh-token"]

  switch (true) {
    case otpPaths.includes(path!):
      return "otp"

    case refreshPaths.includes(path!):
      return "refresh"

    default:
      return "access"
  }
}
