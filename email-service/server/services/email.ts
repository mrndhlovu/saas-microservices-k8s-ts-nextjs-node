import sendgrid from "sendgrid"

import { IEmailEvent } from "@tusksui/shared"

class EmailService {
  private sg = sendgrid(
    "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"
  ) //process.env.SEND_GRID_SECRET_KEY!)

  async send(data: IEmailEvent["data"]) {
    const request = this.sg.emptyRequest({
      method: "POST",
      path: "/v3/mail/send",
      body: {
        personalizations: [
          {
            to: [
              {
                email: data.email,
              },
            ],
            subject: data.subject,
          },
        ],
        from: {
          email: "test@example.com",
        },
        content: [
          {
            type: "text/plain",
            value: data.body,
          },
        ],
      },
    })

    const emailResponse = await this.sg
      .API(request)
      .then(response => response.statusCode)
      .catch(error => error.response.statusCode)

    return emailResponse
  }
}

export const emailService = new EmailService()
