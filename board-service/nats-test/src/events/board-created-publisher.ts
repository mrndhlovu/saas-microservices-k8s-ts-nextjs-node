import { IBoardCreatedEvent, Publisher, Subjects } from "@tuskui/shared"

export class BoardCreatedPublisher extends Publisher<IBoardCreatedEvent> {
  subject: Subjects.BoardCreated = Subjects.BoardCreated
}
