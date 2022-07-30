import { BadRequestError } from "@tusksui/shared"
import { Database } from "./services"
import app from "./app"
import { natsService } from "./services/nats"
import {
  BoardCreatedListener,
  BoardDeletedListener,
  AccountUpdatedListener,
  NewActionListener,
  BoardViewedListener,
  WorkspaceCreatedListener,
} from "./events/listeners"

class Server {
  private static validateEnvVariables() {
    const {
      PORT,
      JWT_ACCESS_TOKEN_SIGNATURE,
      JWT_REFRESH_TOKEN_SIGNATURE,
      JWT_OTP_TOKEN_SIGNATURE,
      MONGO_URI,
      NATS_URL,
      NATS_CLIENT_ID,
      NATS_CLUSTER_ID,
      TOTP_AUTHENTICATOR_SECRET,
    } = process.env

    if (
      !PORT ||
      !JWT_ACCESS_TOKEN_SIGNATURE ||
      !JWT_REFRESH_TOKEN_SIGNATURE ||
      !JWT_OTP_TOKEN_SIGNATURE ||
      !MONGO_URI ||
      !NATS_CLUSTER_ID ||
      !NATS_CLIENT_ID ||
      !NATS_URL ||
      !TOTP_AUTHENTICATOR_SECRET
    ) {
      throw new BadRequestError("Some Env variables are missing!")
    }
  }

  static async start() {
    Server.validateEnvVariables()

    const { NODE_ENV, PORT } = process.env

    const port = parseInt(PORT!, 10)

    await natsService.connect(
      process.env.NATS_CLUSTER_ID!,
      process.env.NATS_CLIENT_ID!,
      process.env.NATS_URL!
    )
    natsService.disconnect()

    new BoardCreatedListener(natsService.client).listen()
    new BoardDeletedListener(natsService.client).listen()
    new AccountUpdatedListener(natsService.client).listen()
    new BoardViewedListener(natsService.client).listen()
    new NewActionListener(natsService.client).listen()
    new WorkspaceCreatedListener(natsService.client).listen()

    await Database.connect()
    app.listen(port, () => {
      const serverStatus = [
        {
          "Server Status": "Online",
          Environment: NODE_ENV!,
          Port: port,
        },
      ]
      console.table(serverStatus)
    })
  }
}

Server.start()
