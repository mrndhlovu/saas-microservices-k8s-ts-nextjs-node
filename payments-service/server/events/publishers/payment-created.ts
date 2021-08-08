import { IAccountCreatedEvent, Publisher, Subjects } from "@tusksui/shared"

export class PaymentCreatedPublisher extends Publisher<IAccountCreatedEvent> {
  subject: Subjects.AccountCreated = Subjects.AccountCreated
}
