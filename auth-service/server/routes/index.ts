import { Router } from "express"

import authRoutes from "./auth"

const getRoutes = () => {
  const router = Router()

  router.use("/auth", authRoutes())

  return router
}

export { getRoutes }
