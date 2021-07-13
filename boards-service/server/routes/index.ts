import { Router } from "express"

import boardRoutes from "./board"

const getRoutes = () => {
  const router = Router()

  router.use("/boards", boardRoutes())

  return router
}

export { getRoutes }
