import { authenticator, totp, hotp } from "otplib"
import bcrypt from "bcrypt"
import qrcode from "qrcode"
import { IUserDocument } from "../models/User"
import { BadRequestError } from "@tusksui/shared"

authenticator.options = { digits: 6 }
totp.options = { digits: 6 }
hotp.options = { digits: 6 }

//
class MultiFactorAuth {
  private secret = authenticator.generate(
    process.env.TOTP_AUTHENTICATOR_SECRET!
  )

  generateToken() {
    return this.secret
  }

  encryptMfaToken = (token: string, saltRounds: number): string => {
    const salt = bcrypt.genSaltSync(saltRounds)
    const hash = bcrypt.hashSync(token, salt)

    return hash
  }

  generateQrCode = async (email: string): Promise<string> => {
    const otp = authenticator.keyuri(
      email,
      "Tusks",
      process.env.TOTP_AUTHENTICATOR_SECRET!
    )
    let image: string = ""

    try {
      image = await qrcode.toDataURL(otp)

      return image
    } catch (error) {
      return image
    }
  }

  generate2StepRecoveryPassword = (user: IUserDocument) => {
    const token = authenticator.generateSecret()

    user.twoStepRecovery.token = token
    return user
  }

  validatedToken(validationToken: string, savedTokenId?: string) {
    try {
      if (savedTokenId) {
        const isMatch = bcrypt.compare(validationToken, savedTokenId)

        if (!isMatch) throw new BadRequestError("Code might have expired")
      }

      const isValid = authenticator.verify({
        token: validationToken,
        secret: process.env.TOTP_AUTHENTICATOR_SECRET!,
      })

      return isValid
    } catch (err) {
      // Possible errors
      // - options validation
      // - "Invalid input - it is not base32 encoded string" (if thiry-two is used)
      console.error(err)

      return false
    }
  }
}

export const mfaService = new MultiFactorAuth()
