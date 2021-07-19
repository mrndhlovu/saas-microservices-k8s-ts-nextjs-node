import express from "express"
import cookieParser from "cookie-parser"
import cookieSession from "cookie-session"
import dotenv from "dotenv"
import "express-async-errors"

import { errorService, BadRequestError } from "@tuskui/shared"

import authRoutes from "../routes"
import services from "../services"
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

    const app = express()

    app.disable("x-powered-by")
    app.set("trust proxy", true)

    app.use(cookieParser())
    app.use(express.json())
    app.use(cookieSession({ signed: false, secure: true }))
    app.use(express.urlencoded({ extended: false }))

    app.use("/api/auth", authRoutes)

    app.use(errorService.errorHandler)
    app.all("*", () => errorService.handleNotFoundError())

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

export default new Server()
