import { BadRequestError } from "@tusksui/shared"

import { app } from "./app"
import { UserDeletedListener } from "./events/listeners"
import { database } from "./services/db"
import { natsService } from "./services/nats"

class Server {
  private loadEnvVariables() {
    const {
      PORT,
      JWT_TOKEN_SIGNATURE,
      JWT_REFRESH_TOKEN_SIGNATURE,
      BOARDS_MONGO_URI,
      NATS_URL,
      NATS_CLIENT_ID,
      NATS_CLUSTER_ID,
    } = process.env

    if (
      !PORT ||
      !JWT_TOKEN_SIGNATURE ||
      !JWT_REFRESH_TOKEN_SIGNATURE ||
      !BOARDS_MONGO_URI ||
      !NATS_CLUSTER_ID ||
      !NATS_CLIENT_ID ||
      !NATS_URL
    ) {
      throw new BadRequestError("Some Env variables are missing!")
    }
  }

  private async connectEventBus() {
    const { NATS_CLUSTER_ID, NATS_CLIENT_ID, NATS_URL } = process.env
    await natsService.connect(NATS_CLUSTER_ID!, NATS_CLIENT_ID!, NATS_URL!)
    natsService.handleOnclose()

    new UserDeletedListener(natsService.client).listen()
  }

  async start() {
    this.loadEnvVariables()

    const { NODE_ENV, PORT } = process.env

    const port = parseInt(PORT!, 10)

    await this.connectEventBus()

    await database.connect()
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

const server = new Server()

server.start()
