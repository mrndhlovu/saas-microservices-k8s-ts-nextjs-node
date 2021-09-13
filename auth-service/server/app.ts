import "express-async-errors"
import cookieParser from "cookie-parser"
import cookieSession from "cookie-session"
import express from "express"

import { errorService } from "@tusksui/shared"

import authRoutes from "./routes"

const BASE_URL = "/api/auth"

const inTestMode = process.env.NODE_ENV === "test"

const app = express()

app.set("trust proxy", true)

app.use(cookieParser())
app.use(express.json())
app.use(cookieSession({ signed: false, secure: !inTestMode }))
app.use(express.urlencoded({ extended: false }))

app.use(BASE_URL, authRoutes)
app.all("*", errorService.handleNotFoundError)
app.use(errorService.errorHandler)

export default app
