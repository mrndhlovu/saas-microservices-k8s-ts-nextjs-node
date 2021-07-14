import { Router } from "express"

import eventRoutes from "./event"

const getRoutes = () => {
  const router = Router()

  router.use("/events", eventRoutes())

  return router
}

export { getRoutes }
