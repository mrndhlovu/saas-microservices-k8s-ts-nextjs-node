import { Router } from "express"

import { authMiddleware, errorService } from "@tusksui/shared"

import { paymentController } from "../controllers"
import { emailMiddleware } from "../middleware"

const router = Router()

router.post(
  "/",
  emailMiddleware.checkRequiredBodyFields,
  emailMiddleware.validateRequestBodyFields,
  authMiddleware.validateRequiredAccessJwt,
  authMiddleware.checkIsAuthenticated,
  errorService.catchAsyncError(paymentController.sendEmail)
)

export { router as emailRoutes }
