import { Router } from "express"

import { Controller } from "../controllers"
import { Services } from "../services"

const router = Router()

const eventRoutes = () => {
  router.post(
    "",
    // Validator.auth.validateRequiredAccessJwt,
    // Validator.auth.checkIsAuthenticated,
    Services.error.catchAsyncError(Controller.Events.emit)
  )

  return router
}

export default eventRoutes
