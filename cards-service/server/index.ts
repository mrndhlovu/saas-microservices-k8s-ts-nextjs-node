import dotenv from "dotenv"

const dotenvResult = dotenv.config()

import server from "./services/server"

if (dotenvResult.error) throw dotenvResult.error

server.start()
