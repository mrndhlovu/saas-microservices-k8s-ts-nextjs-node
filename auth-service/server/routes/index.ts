import { Router } from "express"

import controller from "../controllers"
import middleware from "../middleware"
import services from "../services"

const router = Router()

const { catchAsyncError } = services.error

router.post(
  "/signup",
  middleware.auth.checkRequiredSignUpFields,
  middleware.auth.handleValidationResults,
  middleware.auth.checkDuplicateEmail,
  catchAsyncError(controller.auth.signUpUser)
)

router.get(
  "/me",
  middleware.auth.validateRequiredAccessJwt,
  middleware.auth.checkIsAuthenticated,
  catchAsyncError(controller.auth.getUserInfo)
)

router.post(
  "/login",
  middleware.auth.checkRequiredLoginFields,
  middleware.auth.handleValidationResults,
  catchAsyncError(controller.auth.loginUser)
)

router.get(
  "/logout",
  middleware.auth.validateRequiredAccessJwt,
  middleware.auth.checkIsAuthenticated,
  catchAsyncError(controller.auth.logoutUser)
)

router.patch(
  "/update",
  middleware.auth.validateRequiredAccessJwt,
  middleware.auth.checkIsAuthenticated,
  catchAsyncError(controller.auth.updateUser)
)

router.delete(
  "/delete",
  middleware.auth.validateRequiredAccessJwt,
  middleware.auth.checkIsAuthenticated,
  catchAsyncError(controller.auth.deleteUser)
)

router.get(
  "/token/:refreshToken",
  middleware.auth.validateRequiredRefreshJwt,
  catchAsyncError(controller.auth.getRefreshToken)
)

export default router
