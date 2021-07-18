import auth from "./auth"
import database from "./db"
import errorService from "./error"
import role from "./role"
import server from "./server"

export const Services = server

export default {
  error: new errorService(),
  database,
  role,
  auth,
}
