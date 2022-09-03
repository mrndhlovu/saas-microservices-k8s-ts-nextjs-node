import { IRemoveBoardMemberEvent, Publisher, Subjects } from "@tusksui/shared"

export class RemoveBoardMemberPublisher extends Publisher<IRemoveBoardMemberEvent> {
  subject: Subjects.RemoveBoardMember = Subjects.RemoveBoardMember
}
