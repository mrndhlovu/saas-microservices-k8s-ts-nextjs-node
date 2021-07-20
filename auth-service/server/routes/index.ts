import { Router } from "express"

import { authMiddleware, errorService } from "@tuskui/shared"

import { authController } from "../controller"

const router = Router()

router.get(
  "/me",
  authMiddleware.validateRequiredAccessJwt,
  authMiddleware.checkIsAuthenticated,
  errorService.catchAsyncError(authController.getUserInfo)
)

router.get(
  "/logout",
  authMiddleware.validateRequiredAccessJwt,
  authMiddleware.checkIsAuthenticated,
  errorService.catchAsyncError(authController.logoutUser)
)

router.patch(
  "/update",
  authMiddleware.validateRequiredAccessJwt,
  authMiddleware.checkIsAuthenticated,
  errorService.catchAsyncError(authController.updateUser)
)

router.delete(
  "/delete",
  authMiddleware.validateRequiredAccessJwt,
  authMiddleware.checkIsAuthenticated,
  errorService.catchAsyncError(authController.deleteUser)
)

router.get(
  "/token/:refreshToken",
  authMiddleware.validateRequiredRefreshJwt,
  errorService.catchAsyncError(authController.getRefreshToken)
)

export default router
