import express from "express"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"

import { getRoutes } from "../routes"
import Services from "../services"

class Server {
  start() {
    this.validateEnvVariables()

    const { NODE_ENV, PORT } = process.env

    const port = parseInt(PORT!, 10)

    const app = express()
    app.use(cookieParser())
    app.use(express.json())
    // app.use(cookieSession())
    app.use(express.urlencoded({ extended: false }))

    app.enable("trust proxy")
    app.use(Services.error.errorHandler)
    app.use("/api", getRoutes())

    app.disable("x-powered-by")

    app.listen(port, () => {
      const serverStatus = [
        {
          "server Status": "Online",
          Environment: NODE_ENV!,
          Port: port,
        },
      ]
      console.table(serverStatus)
    })

    Services.database.connect()
  }

  private validateEnvVariables() {
    const dotenvResult = dotenv.config()
    const { PORT, TOKEN_SIGNATURE, REFRESH_TOKEN_SIGNATURE, MONGO_DB_URI } =
      process.env

    if (dotenvResult.error) throw dotenvResult.error
    if (
      !PORT ||
      !TOKEN_SIGNATURE ||
      !REFRESH_TOKEN_SIGNATURE ||
      !MONGO_DB_URI
    ) {
      throw new Error("Some Env variables are missing!")
    }
  }
}

export default new Server()
