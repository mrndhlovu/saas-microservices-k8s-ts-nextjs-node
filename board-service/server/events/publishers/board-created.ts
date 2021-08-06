import { IBoardCreatedEvent, Publisher, Subjects } from "@tusksui/shared"

export class BoardCreatedPublisher extends Publisher<IBoardCreatedEvent> {
  subject: Subjects.BoardCreated = Subjects.BoardCreated
}
