import mongoose from "mongoose"

import { CustomDatabaseRequestError } from "../middleware/error"
class Database {
  private mongooseOptions = {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }

  private retryAttempts = 0

  private alertAdmin(error: Error) {
    const dbStatus = [
      {
        "database Status": "Offline",

        Attempts: this.retryAttempts,
      },
    ]
    console.table(dbStatus)
    console.error(error.message)
  }

  connect = () => {
    mongoose
      .connect(process.env.MONGO_DB_URI!, this.mongooseOptions)
      .then(() => {
        const dbStatus = [{ "database Status": "Online" }]
        console.table(dbStatus)
      })
      .catch((err: Error) => {
        this.retryAttempts++
        if (this.retryAttempts > 5) {
          return this.alertAdmin(err)
        }
        const dbStatus = [
          {
            "database Status": "Error",
            Attempts: this.retryAttempts,
          },
        ]
        console.table(dbStatus)
        throw new CustomDatabaseRequestError(err.message)

        // setTimeout(this.connect, 2000)
      })
  }
}

export default new Database()
