import mailgun from "mailgun-js"
import { BadRequestError, IEmailEvent } from "@tusksui/shared"

const apiKey = process.env.MAILGUN_SECRET_KEY!
var domain = "mg.cacheops.io"

const mgClient = mailgun({
  apiKey,
  domain,
  protocol: "https:",
  host: "api.eu.mailgun.net",
})

class EmailService {
  static async send(data: IEmailEvent["data"]) {
    const msg = {
      cc: data.cc!,
      from: data.from,
      subject: data.subject,
      html: data.body,
      to: [data.email],
    }

    try {
      const response = await mgClient.messages().send(msg, err => {
        if (err) throw new BadRequestError(err as any)

        return 200
      })

      return response
    } catch (error) {
      console.error((error as Error).message)

      return 400
    }
  }
}

export { EmailService }
