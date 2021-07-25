import { IUserDeletedEvent, Publisher, Subjects } from "@tuskui/shared"

export class UserDeletedPublisher extends Publisher<IUserDeletedEvent> {
  subject: Subjects.UserDeleted = Subjects.UserDeleted
}
