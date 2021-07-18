import mongoose from "mongoose"

class Database {
  private mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  }

  private retryAttempts = 0

  private alertAdmin(error: Error) {
    const dbStatus = [
      {
        "Database Status": "Offline",

        Attempts: this.retryAttempts,
      },
    ]
    console.table(dbStatus)
    console.log(error.message)
  }

  connect = async () => {
    await mongoose
      .connect(process.env.MONGO_DB_URI!, this.mongooseOptions)
      .then(() => {
        const dbStatus = [
          {
            "Database Status": "Online",
            "Database Name": "Mongo",
          },
        ]
        console.table(dbStatus)
      })
      .catch((err: Error) => {
        this.retryAttempts++
        if (this.retryAttempts > 5) {
          return this.alertAdmin(err)
        }
        const dbStatus = [
          {
            "Database Status": "Error",
            Attempts: this.retryAttempts,
          },
        ]
        console.table(dbStatus)

        setTimeout(this.connect, 2000)
      })
  }
}

export default new Database()
