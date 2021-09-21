import { IAuthedActivityEvent, Publisher, Subjects } from "@tusksui/shared"

export class AuthedActivityPublisher extends Publisher<IAuthedActivityEvent> {
  subject: Subjects.AuthedActivity = Subjects.AuthedActivity
}
