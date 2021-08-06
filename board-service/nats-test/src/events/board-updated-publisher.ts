import { IBoardUpdatedEvent, Publisher, Subjects } from "@tusksui/shared"

export class BoardUpdatedPublisher extends Publisher<IBoardUpdatedEvent> {
  subject: Subjects.BoardUpdated = Subjects.BoardUpdated
}
