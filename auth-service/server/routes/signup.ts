import { Router } from "express"

import { authMiddleware, errorService } from "@tuskui/shared"

import { authController } from "../controller"

const router = Router()

router.post(
  "/api/auth/signup",
  authMiddleware.checkRequiredSignUpFields,
  authMiddleware.handleValidationResults,
  authMiddleware.checkDuplicateEmail,
  errorService.catchAsyncError(authController.signUpUser)
)

export { router as signupRouter }
