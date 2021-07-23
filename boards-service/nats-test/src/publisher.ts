import nats from "node-nats-streaming"
console.clear()

const stan = nats.connect("boards", "abc", {
  url: "http://localhost:4222",
})

stan.on("connect", () => {
  console.log("Publisher connected to NATS")

  const data = JSON.stringify({
    id: "123",
    boardId: "styuiopoiuytrertyuio",
  })

  stan.publish("board:created", data, () => {
    console.log("Event published")
  })
})
