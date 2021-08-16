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
  authMiddleware.findCurrentUser,
  errorService.catchAsyncError(authController.getCurrentUser)
)

router.post(
  "/login",
  authMiddleware.checkRequiredLoginFields,
  middlewareUtils.validateRequestBodyFields,
  authMiddleware.checkMultiFactorAuth,
  errorService.catchAsyncError(authController.loginUser)
)

router.post(
  "/login-verify",
  authMiddleware.checkRequiredLoginFields,
  middlewareUtils.validateRequestBodyFields,
  errorService.catchAsyncError(authController.verifyCredentials)
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
  errorService.catchAsyncError(authController.deleteUser)
)

router.post(
  "/mfa/enable",
  middlewareUtils.validateRequiredAccessJwt,
  middlewareUtils.checkIsAuthenticated,
  authMiddleware.findCurrentUser,
  errorService.catchAsyncError(authController.enableMfa)
)

router.get(
  "/mfa/qr-code",
  middlewareUtils.validateRequiredAccessJwt,
  middlewareUtils.checkIsAuthenticated,
  authMiddleware.findCurrentUser,
  errorService.catchAsyncError(authController.getQrCode)
)

router.post(
  "/mfa/validate",
  middlewareUtils.validateRequiredAccessJwt,
  middlewareUtils.checkIsAuthenticated,
  authMiddleware.findPendingMfaUser,
  errorService.catchAsyncError(authController.verifyMfa)
)

router.post(
  "/mfa/connect",
  middlewareUtils.validateRequiredAccessJwt,
  middlewareUtils.checkIsAuthenticated,
  authMiddleware.findCurrentUser,
  errorService.catchAsyncError(authController.connectMfa)
)

router.post(
  "/get-verification-link",
  errorService.catchAsyncError(authController.getVerificationEmail)
)

router.get(
  "/refresh-token",
  middlewareUtils.validateRequiredRefreshJwt,
  errorService.catchAsyncError(authController.getRefreshToken)
)

export default router
