import "express-async-errors"
import cookieParser from "cookie-parser"
import cookieSession from "cookie-session"
import express from "express"

import { errorService } from "@tuskui/shared"

import authRoutes from "./routes"

const app = express()

app.set("trust proxy", true)

app.use(cookieParser())
app.use(express.json())
app.use(cookieSession({ signed: false, secure: true }))
app.use(express.urlencoded({ extended: false }))

app.use("/api/auth", authRoutes)

app.all("*", errorService.handleNotFoundError)
app.use(errorService.errorHandler)

export { app }
