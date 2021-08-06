import { Router } from "express"

import {
  errorService,
  authMiddleware as middlewareUtils,
} from "@tusksui/shared"

import { authController } from "../controller"
import { authMiddleware } from "../middleware/auth"

const router = Router()

router.post(
  "/signup",
  authMiddleware.checkRequiredSignUpFields,
  middlewareUtils.validateRequestBodyFields,
  authMiddleware.checkDuplicateEmail,
  errorService.catchAsyncError(authController.signUpUser)
)

router.get(
  "/me",
  middlewareUtils.checkIsAuthenticated,
  authMiddleware.verifyCurrentUser,
  errorService.catchAsyncError(authController.getCurrentUser)
)

router.post(
  "/login",
  authMiddleware.checkRequiredLoginFields,
  middlewareUtils.validateRequestBodyFields,
  errorService.catchAsyncError(authController.loginUser)
)

router.get(
  "/logout",
  middlewareUtils.validateRequiredAccessJwt,
  middlewareUtils.checkIsAuthenticated,
  authMiddleware.findCurrentUser,
  errorService.catchAsyncError(authController.logoutUser)
)

router.patch(
  "/update",
  middlewareUtils.validateRequiredAccessJwt,
  middlewareUtils.checkIsAuthenticated,
  authMiddleware.findCurrentUser,
  errorService.catchAsyncError(authController.updateUser)
)

router.delete(
  "/delete",
  middlewareUtils.validateRequiredAccessJwt,
  middlewareUtils.checkIsAuthenticated,
  authMiddleware.findCurrentUser,
  errorService.catchAsyncError(authController.deleteUser)
)

router.get(
  "/refresh-token",
  middlewareUtils.validateRequiredRefreshJwt,
  errorService.catchAsyncError(authController.getRefreshToken)
)

export default router
