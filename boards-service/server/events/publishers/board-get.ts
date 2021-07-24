import { IGetBoardEvent, Publisher, Subjects } from "@tuskui/shared"

export class BoardByIdPublisher extends Publisher<IGetBoardEvent> {
  subject: Subjects.GetBoardById = Subjects.GetBoardById
}
