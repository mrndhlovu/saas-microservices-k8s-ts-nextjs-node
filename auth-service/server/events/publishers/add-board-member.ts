import { IAddBoardMemberEvent, Publisher, Subjects } from "@tusksui/shared"

export class AddBoardMemberPublisher extends Publisher<IAddBoardMemberEvent> {
  subject: Subjects.AddBoardMember = Subjects.AddBoardMember
}
