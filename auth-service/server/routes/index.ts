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
  middlewareUtils.validateRequiredAccessJwt,
  AuthMiddleWare.checkIsAuthenticated,
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
  "/confirm-action",
  AuthMiddleWare.checkRequiredLoginFields,
  middlewareUtils.validateRequestBodyFields,
  AuthMiddleWare.validateUser,
  errorService.catchAsyncError(authController.confirmAction)
)

router.get(
  "/logout",
  middlewareUtils.validateRequiredAccessJwt,
  AuthMiddleWare.checkIsAuthenticated,
  AuthMiddleWare.findCurrentUser,
  errorService.catchAsyncError(authController.logoutUser)
)

router.get(
  "/logout-all",
  middlewareUtils.validateRequiredAccessJwt,
  AuthMiddleWare.checkIsAuthenticated,
  AuthMiddleWare.findCurrentUser,
  errorService.catchAsyncError(authController.logoutAllSessions)
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
  AuthMiddleWare.checkIsAuthenticated,
  AuthMiddleWare.findCurrentUser,
  errorService.catchAsyncError(authController.updatePassword)
)

router.get(
  "/refresh-token",
  AuthMiddleWare.findRequiredRefreshJwt,
  AuthMiddleWare.findCurrentUser,
  errorService.catchAsyncError(authController.refreshToken)
)

router.post(
  "/forgot-password",
  errorService.catchAsyncError(authController.handleForgotPassword)
)

router.post(
  "/recover-account",
  AuthMiddleWare.checkIsAuthenticated,
  AuthMiddleWare.findCurrentUser,
  errorService.catchAsyncError(authController.validateAccount)
)

router.get(
  "/pause-account/:token",
  AuthMiddleWare.validateParamAuthToken,
  AuthMiddleWare.findCurrentUser,
  errorService.catchAsyncError(authController.pauseAccount)
)

router.post(
  "/restore-account/verify-email",
  errorService.catchAsyncError(authController.verifyRecoveryEmail)
)

router.post(
  "/restore-account",
  AuthMiddleWare.checkIsAuthenticated,
  AuthMiddleWare.findCurrentUser,
  errorService.catchAsyncError(authController.restoreAccount)
)

router.delete(
  "/delete",
  middlewareUtils.validateRequiredAccessJwt,
  AuthMiddleWare.checkIsAuthenticated,
  errorService.catchAsyncError(authController.deleteUser)
)

router.post(
  "/verify-otp",
  AuthMiddleWare.checkIsAuthenticated,
  AuthMiddleWare.findCurrentUser,
  errorService.catchAsyncError(authController.verifyOtp)
)

router.post(
  "/resend-otp",
  errorService.catchAsyncError(authController.resendOtp)
)

router.post(
  "/mfa/enable",
  middlewareUtils.validateRequiredAccessJwt,
  AuthMiddleWare.checkIsAuthenticated,
  AuthMiddleWare.findCurrentUser,
  errorService.catchAsyncError(authController.enableMfa)
)

router.get(
  "/mfa/qr-code",
  middlewareUtils.validateRequiredAccessJwt,
  AuthMiddleWare.checkIsAuthenticated,
  AuthMiddleWare.findCurrentUser,
  errorService.catchAsyncError(authController.getQrCode)
)

router.post(
  "/mfa/validate",
  middlewareUtils.validateRequiredAccessJwt,
  AuthMiddleWare.checkIsAuthenticated,
  AuthMiddleWare.findPendingMfaUser
  // errorService.catchAsyncError(authController.verifyMfa)
)

router.post(
  "/mfa/connect",
  middlewareUtils.validateRequiredAccessJwt,
  AuthMiddleWare.checkIsAuthenticated,
  AuthMiddleWare.findCurrentUser
  // errorService.catchAsyncError(authController.connectMfa)
)

// router.post(
//   "/request-verification-email",
//   errorService.catchAsyncError(authController.getVerificationEmail)
// )

export default router
