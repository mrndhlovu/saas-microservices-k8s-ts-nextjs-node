import nats from "node-nats-streaming"
import { randomBytes } from "crypto"
import { BoardCreatedListener } from "./events/board-created-listener"
import { BoardUpdatedListener } from "./events/board-updated-listener"

console.clear()

const stan = nats.connect("boards", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
})

stan.on("connect", () => {
  console.log("Listener connected to NATS")

  stan.on("close", () => {
    console.log("NATS process closed")
    process.exit()
  })

  new BoardCreatedListener(stan).listen()
  new BoardUpdatedListener(stan).listen()
})

process.on("SIGINT", () => stan.close())
process.on("SIGTERM", () => stan.close())
