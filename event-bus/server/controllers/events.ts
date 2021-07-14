import axios from "axios"
import { Request, Response } from "express"

class EventsController {
  emit = async (req: Request, res: Response) => {
    const servicePorts = ["4000", "4001", "4002", "4003"]
    const event = req.body
    const baseUrl = `${process.env.BASE_URL}`

    servicePorts.forEach(port => axios.post(`${baseUrl}:${port}/events`, event))

    res.status(200).send({ status: "OK" })
  }
}

export default new EventsController()
