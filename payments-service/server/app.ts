import "express-async-errors"
import cookieParser from "cookie-parser"
import cookieSession from "cookie-session"
import express from "express"

import { errorService } from "@tusksui/shared"

import { paymentRoutes } from "./routes"

const app = express()

app.set("trust proxy", true)
app.use(cookieParser())
app.use(express.json())
app.use(
  cookieSession({ signed: false, secure: process.env.NODE_ENV !== "test" })
)
app.use(express.urlencoded({ extended: false }))
app.use("/api/payments", paymentRoutes)

app.all("*", errorService.handleNotFoundError)
app.use(errorService.errorHandler)

export default app
