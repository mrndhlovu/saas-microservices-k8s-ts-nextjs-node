import mongoose from "mongoose"

export class Database {
  private static mongooseOptions = {
    useNewUrlParser: true,
    retryWrites: true,
  }

  static async connect() {
    await mongoose
      .connect(process.env.MONGO_URI!, {
        ...Database.mongooseOptions,
        dbName: "auth",
      })
      .catch((err: Error) => {
        console.log(err.message)

        const dbStatus = [
          {
            "Database Status [AS]": "Error",
          },
        ]
        console.table(dbStatus)
      })
  }
}
