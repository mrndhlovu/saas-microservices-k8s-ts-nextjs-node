import { IGetBoardListEvent, Publisher, Subjects } from "@tuskui/shared"

export class BoardListPublisher extends Publisher<IGetBoardListEvent> {
  subject: Subjects.GetBoards = Subjects.GetBoards
}
