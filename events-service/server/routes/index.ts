import { Router } from "express"

import listRoutes from "./list"

const getRoutes = () => {
  const router = Router()

  router.use("/lists", listRoutes())

  return router
}

export { getRoutes }
