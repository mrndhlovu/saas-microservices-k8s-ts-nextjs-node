import { IEmailEvent, Publisher, Subjects } from "@tusksui/shared"

export class SendEmailPublisher extends Publisher<IEmailEvent> {
  subject: Subjects.Email = Subjects.Email
}
