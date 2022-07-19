import { Router } from "express"

import {
  errorService,
  authMiddleware as middlewareUtils,
} from "@tusksui/shared"

import { authController } from "../controller"
import { AuthMiddleWare } from "../middleware/auth"

const router = Router()

router.post(
  "/register",
  AuthMiddleWare.checkRequiredSignUpFields,
  middlewareUtils.validateRequestBodyFields,
  AuthMiddleWare.checkDuplicateEmail,
  errorService.catchAsyncError(authController.signUpUser)
)

router.get(
  "/me",
  middlewareUtils.checkIsAuthenticated,
  AuthMiddleWare.findCurrentUser,
  errorService.catchAsyncError(authController.getCurrentUser)
)

router.post(
  "/login",
  AuthMiddleWare.checkRequiredLoginFields,
  middlewareUtils.validateRequestBodyFields,
  AuthMiddleWare.validateUser,
  errorService.catchAsyncError(authController.loginUser)
)

router.post(
  "/verify-credentials",
  AuthMiddleWare.checkRequiredLoginFields,
  middlewareUtils.validateRequestBodyFields,
  errorService.catchAsyncError(authController.verifyCredentials)
)

router.get(
  "/logout",
  middlewareUtils.validateRequiredAccessJwt,
  middlewareUtils.checkIsAuthenticated,
  AuthMiddleWare.findCurrentUser,
  errorService.catchAsyncError(authController.logoutUser)
)

router.patch(
  "/update",
  middlewareUtils.validateRequiredAccessJwt,
  middlewareUtils.checkIsAuthenticated,
  AuthMiddleWare.findCurrentUser,
  errorService.catchAsyncError(authController.updateUser)
)

router.patch(
  "/update-password",
  middlewareUtils.validateRequiredAccessJwt,
  middlewareUtils.checkIsAuthenticated,
  AuthMiddleWare.findCurrentUser,
  errorService.catchAsyncError(authController.updatePassword)
)

router.get(
  "/refresh-token",
  // middlewareUtils.validateRequiredRefreshJwt,
  errorService.catchAsyncError(authController.refreshToken)
)

router.post(
  "/forgot-password",
  errorService.catchAsyncError(authController.forgotPassword)
)

router.delete(
  "/delete",
  middlewareUtils.validateRequiredAccessJwt,
  middlewareUtils.checkIsAuthenticated,
  errorService.catchAsyncError(authController.deleteUser)
)

router.post(
  "/mfa/enable",
  middlewareUtils.validateRequiredAccessJwt,
  middlewareUtils.checkIsAuthenticated,
  AuthMiddleWare.findCurrentUser,
  errorService.catchAsyncError(authController.enableMfa)
)

router.get(
  "/mfa/qr-code",
  middlewareUtils.validateRequiredAccessJwt,
  middlewareUtils.checkIsAuthenticated,
  AuthMiddleWare.findCurrentUser,
  errorService.catchAsyncError(authController.getQrCode)
)

router.post(
  "/mfa/validate",
  middlewareUtils.validateRequiredAccessJwt,
  middlewareUtils.checkIsAuthenticated,
  AuthMiddleWare.findPendingMfaUser,
  errorService.catchAsyncError(authController.verifyMfa)
)

router.post(
  "/mfa/connect",
  middlewareUtils.validateRequiredAccessJwt,
  middlewareUtils.checkIsAuthenticated,
  AuthMiddleWare.findCurrentUser,
  errorService.catchAsyncError(authController.connectMfa)
)

router.post(
  "/verification-email",
  errorService.catchAsyncError(authController.getVerificationEmail)
)

export default router
