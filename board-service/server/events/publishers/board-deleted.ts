import { IBoardDeletedEvent, Publisher, Subjects } from "@tuskui/shared"

export class BoardDeletedPublisher extends Publisher<IBoardDeletedEvent> {
  subject: Subjects.BoardDeleted = Subjects.BoardDeleted
}
