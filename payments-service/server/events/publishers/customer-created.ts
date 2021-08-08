import { ICustomerCreated, Publisher, Subjects } from "@tusksui/shared"

export class CustomerCreatedPublisher extends Publisher<ICustomerCreated> {
  subject: Subjects.CustomerCreated = Subjects.CustomerCreated
}
