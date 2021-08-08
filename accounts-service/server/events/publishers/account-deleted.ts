import { IAccountDeletedEvent, Publisher, Subjects } from "@tusksui/shared"

export class AccountDeletedPublisher extends Publisher<IAccountDeletedEvent> {
  subject: Subjects.AccountDeleted = Subjects.AccountDeleted
}
