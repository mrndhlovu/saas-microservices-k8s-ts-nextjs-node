import { Router } from "express"

import { authMiddleware, errorService } from "@tuskui/shared"

import { authController } from "../controller"

const router = Router()

router.post(
  "/api/auth/login",
  authMiddleware.checkRequiredLoginFields,
  authMiddleware.handleValidationResults,
  errorService.catchAsyncError(authController.loginUser)
)

export { router as loginRouter }
