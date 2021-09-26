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
      CLOUDINARY_API_SECRET,
      CLOUDINARY_API_KEY,
      CLOUDINARY_CLOUD_NAME,
      UNSPLASH_ACCESS_KEY,
      REGION_AWS,
      ACCESS_KEY_ID_AWS,
      SECRET_ACCESS_KEY_AWS,
      S3_BUCKET_AWS,
    } = process.env

    if (
      !PORT ||
      !JWT_TOKEN_SIGNATURE ||
      !JWT_REFRESH_TOKEN_SIGNATURE ||
      !BOARDS_MONGO_URI ||
      !NATS_CLUSTER_ID ||
      !NATS_CLIENT_ID ||
      !NATS_URL ||
      !CLOUDINARY_CLOUD_NAME ||
      !CLOUDINARY_API_KEY ||
      !CLOUDINARY_API_SECRET ||
      !UNSPLASH_ACCESS_KEY ||
      !SECRET_ACCESS_KEY_AWS ||
      !ACCESS_KEY_ID_AWS ||
      !REGION_AWS ||
      !S3_BUCKET_AWS
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
