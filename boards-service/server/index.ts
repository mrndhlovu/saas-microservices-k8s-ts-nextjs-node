import { BadRequestError } from "@tuskui/shared"

import { app } from "./app"
import { database } from "./services/db"
import { natsService } from "./services/nats"
class Server {
  private validateEnvVariables() {
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

  async start() {
    this.validateEnvVariables()

    const { NODE_ENV, PORT } = process.env

    const port = parseInt(PORT!, 10)

    await natsService.connect(
      process.env.NATS_CLUSTER_ID!,
      process.env.NATS_CLIENT_ID!,
      process.env.NATS_URL!
    )
    natsService.handleOnclose()

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
