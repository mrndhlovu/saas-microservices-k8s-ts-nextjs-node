import { IBoardViewedEvent, Publisher, Subjects } from "@tusksui/shared"

export class BoardViewedPublisher extends Publisher<IBoardViewedEvent> {
  subject: Subjects.BoardViewed = Subjects.BoardViewed
}
