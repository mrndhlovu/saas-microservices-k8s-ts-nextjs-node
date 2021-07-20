import dotenv from "dotenv"

import { BadRequestError } from "@tuskui/shared"

import services from "./services"
import { app } from "./app"
class Server {
  private validateEnvVariables() {
    const dotenvResult = dotenv.config()
    const {
      PORT,
      JWT_TOKEN_SIGNATURE,
      JWT_REFRESH_TOKEN_SIGNATURE,
      MONGO_DB_URI,
    } = process.env

    if (dotenvResult.error) throw dotenvResult.error
    if (
      !PORT ||
      !JWT_TOKEN_SIGNATURE ||
      !JWT_REFRESH_TOKEN_SIGNATURE ||
      !MONGO_DB_URI
    ) {
      throw new BadRequestError("Some Env variables are missing!")
    }
  }

  async start() {
    this.validateEnvVariables()

    const { NODE_ENV, PORT } = process.env

    const port = parseInt(PORT!, 10)

    await services.database.connect()
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
