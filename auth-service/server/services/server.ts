import express from "express"
import cookieParser from "cookie-parser"

import { getRoutes } from "../routes"
import { Services } from "../services"

class server {
  start() {
    const { NODE_ENV, PORT } = process.env

    const port = parseInt(PORT!, 10)

    const app = express()
    app.use(cookieParser())
    app.use(express.json())
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
}

export default new server()
