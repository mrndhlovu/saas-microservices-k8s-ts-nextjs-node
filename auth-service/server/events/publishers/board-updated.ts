import { IBoardUpdatedEvent, Publisher, Subjects } from "@tuskui/shared"

export class BoardUpdatedPublisher extends Publisher<IBoardUpdatedEvent> {
  subject: Subjects.BoardUpdated = Subjects.BoardUpdated
}
