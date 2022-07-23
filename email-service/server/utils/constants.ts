export const requiredEmailFields = ["email", "body", "subject"]

export const EMAILS = {
  "user:register": {
    html: `
      <p>To complete your sign up, and as an additional security measure, you are requested to enter the one-time password (OTP) provided in this email.<p>
      <br>The OTP code is: <strong>%email</strong>`,
    subject: "Email verification to activate your account.",
  },
}
