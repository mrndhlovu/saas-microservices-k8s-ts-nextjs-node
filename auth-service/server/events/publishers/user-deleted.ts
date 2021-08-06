import { IUserDeletedEvent, Publisher, Subjects } from "@tusksui/shared"

export class UserDeletedPublisher extends Publisher<IUserDeletedEvent> {
  subject: Subjects.UserDeleted = Subjects.UserDeleted
}
