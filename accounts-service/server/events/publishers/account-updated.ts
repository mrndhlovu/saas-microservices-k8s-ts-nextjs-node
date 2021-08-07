import { IAccountUpdatedEvent, Publisher, Subjects } from "@tusksui/shared"

export class AccountUpdatedPublisher extends Publisher<IAccountUpdatedEvent> {
  subject: Subjects.AccountUpdated = Subjects.AccountUpdated
}
