import { IAccountCreatedEvent, Publisher, Subjects } from "@tusksui/shared"

export class AccountCreatedPublisher extends Publisher<IAccountCreatedEvent> {
  subject: Subjects.AccountCreated = Subjects.AccountCreated
}
