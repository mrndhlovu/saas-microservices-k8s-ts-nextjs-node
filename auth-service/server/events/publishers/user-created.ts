import { IUserCreatedEvent, Publisher, Subjects } from "@tusksui/shared"

export class UserCreatedPublisher extends Publisher<IUserCreatedEvent> {
  subject: Subjects.UserCreated = Subjects.UserCreated
}
