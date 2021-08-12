import sgMail from "@sendgrid/mail"

import { IEmailEvent } from "@tusksui/shared"

sgMail.setApiKey(process.env.SEND_GRID_SECRET_KEY!)

class EmailService {
  async send(data: IEmailEvent["data"]) {
    const msg = {
      cc: data.cc!,
      from: data.from,
      html: data.html!,
      subject: data.subject,
      text: data.body,
      to: data.email,
    }

    try {
      await sgMail.send(msg)
      return 200
    } catch (error) {
      if (error.response) {
        console.error(error.response.body)
      }

      return 400
    }
  }
}

export const emailService = new EmailService()
