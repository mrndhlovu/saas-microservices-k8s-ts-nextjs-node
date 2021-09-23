import { IAuthedActionEvent, Publisher, Subjects } from "@tusksui/shared"

export class AuthedActionPublisher extends Publisher<IAuthedActionEvent> {
  subject: Subjects.AuthedAction = Subjects.AuthedAction
}
