import auth from "./auth"
import database from "./db"
import error from "./error"
import role from "./role"
import server from "./server"

class Service {
  constructor() {
    this.error
    this.database
    this.role
    this.auth
  }
  error = error
  database = database
  role = role
  server = server
  auth = auth
}

export const Services = Service

export default new Service()
