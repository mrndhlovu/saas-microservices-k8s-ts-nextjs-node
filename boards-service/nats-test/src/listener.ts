import nats, { Message } from "node-nats-streaming"
import { randomBytes } from "crypto"

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

  const options = stan
    .subscriptionOptions()
    .setManualAckMode(true)
    .setDeliverAllAvailable()
    .setDurableName("board-service")

  const subscription = stan.subscribe(
    "board:created",
    // "listener:created:board",
    options
  )

  subscription.on("message", (msg: Message) => {
    const data = msg.getData()

    if (typeof data === "string") {
      console.log(`Received event ${msg.getSequence()}, with data: ${data}`)
    }

    msg.ack()
  })
})

process.on("SIGINT", () => stan.close())
process.on("SIGTERM", () => stan.close())
