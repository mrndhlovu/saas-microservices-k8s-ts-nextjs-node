import { Router } from "express"

import cardRoutes from "./card"

const getRoutes = () => {
  const router = Router()

  router.use("/cards", cardRoutes())

  return router
}

export { getRoutes }
