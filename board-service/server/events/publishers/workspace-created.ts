import { IWorkspaceCreatedEvent, Publisher, Subjects } from "@tusksui/shared"

export class WorkspaceCreatedPublisher extends Publisher<IWorkspaceCreatedEvent> {
  subject: Subjects.WorkspaceCreated = Subjects.WorkspaceCreated
}
