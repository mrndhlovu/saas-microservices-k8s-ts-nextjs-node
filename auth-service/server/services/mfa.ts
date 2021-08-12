import { authenticator, totp, hotp } from "otplib"

authenticator.options = { digits: 6 }
totp.options = { digits: 6 }
hotp.options = { digits: 6 }

class MultiFactorAuth {
  generateToken() {
    const token = authenticator.generate(process.env.TOTP_AUTHENTICATOR_SECRET!)
    return token
  }

  validatedToken(validationToken: string) {
    try {
      const isValid = authenticator.verify({
        token: validationToken,
        secret: process.env.TOTP_AUTHENTICATOR_SECRET!,
      })

      return { success: isValid }
    } catch (err) {
      // Possible errors
      // - options validation
      // - "Invalid input - it is not base32 encoded string" (if thiry-two is used)
      console.error(err)

      return { success: false }
    }
  }
}

export const mfaService = new MultiFactorAuth()
