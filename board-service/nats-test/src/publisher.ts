import nats from "node-nats-streaming"
import { BoardCreatedPublisher } from "./events/board-created-publisher"
import { BoardUpdatedPublisher } from "./events/board-updated-publisher"

console.clear()

const stan = nats.connect("boards", "abc", {
  url: "http://localhost:4222",
})

stan.on("connect", async () => {
  console.log("Publisher connected to NATS")

  const publisher = new BoardUpdatedPublisher(stan)
  // const publisherUpdated = new BoardUpdatedPublisher(stan)

  await publisher.publish({
    id: "1123",
    title: "Test",
    ownerId: "rtyuioh",
  })
})
