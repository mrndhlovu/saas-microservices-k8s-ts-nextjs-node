import { IBoardDeletedEvent, Publisher, Subjects } from "@tusksui/shared"

export class BoardDeletedPublisher extends Publisher<IBoardDeletedEvent> {
  subject: Subjects.BoardDeleted = Subjects.BoardDeleted
}
