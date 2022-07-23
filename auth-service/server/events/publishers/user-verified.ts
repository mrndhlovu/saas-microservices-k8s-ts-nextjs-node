import { IUserVerifiedEvent, Publisher, Subjects } from "@tusksui/shared"

export class UserVerifiedPublisher extends Publisher<IUserVerifiedEvent> {
  subject: Subjects.UserVerified = Subjects.UserVerified
}
