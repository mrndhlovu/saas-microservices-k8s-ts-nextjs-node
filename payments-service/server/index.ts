import { BadRequestError } from "@tusksui/shared"

import app from "./app"
import { database } from "./services/db"
import { natsService } from "./services/nats"
import {
  AccountUpdatedListener,
  AccountDeletedListener,
} from "./events/listeners"

class Server {
  private loadEnvVariables() {
    const {
      NATS_CLIENT_ID,
      NATS_CLUSTER_ID,
      NATS_URL,
      PAYMENTS_MONGO_URI,
      PORT,
      STRIPE_SECRET_KEY,
    } = process.env

    if (
      !NATS_CLIENT_ID ||
      !NATS_CLUSTER_ID ||
      !NATS_URL ||
      !PAYMENTS_MONGO_URI ||
      !PORT ||
      !STRIPE_SECRET_KEY
    ) {
      throw new BadRequestError("Some Env variables are missing!")
    }
  }

  private async connectEventBus() {
    const { NATS_CLUSTER_ID, NATS_CLIENT_ID, NATS_URL } = process.env
    await natsService.connect(NATS_CLUSTER_ID!, NATS_CLIENT_ID!, NATS_URL!)
    natsService.handleOnclose()

    new AccountUpdatedListener(natsService.client).listen()
    new AccountDeletedListener(natsService.client).listen()
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
          "[PS] Server Status": "Online",
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
