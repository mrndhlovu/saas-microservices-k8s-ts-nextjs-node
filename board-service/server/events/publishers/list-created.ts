import { IListCreatedEvent, Publisher, Subjects } from "@tuskui/shared"

export class ListCreatedPublisher extends Publisher<IListCreatedEvent> {
  subject: Subjects.ListCreated = Subjects.ListCreated
}
