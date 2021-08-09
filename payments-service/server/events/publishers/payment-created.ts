import { IPaymentCreatedEvent, Publisher, Subjects } from "@tusksui/shared"

export class PaymentCreatedPublisher extends Publisher<IPaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated
}
