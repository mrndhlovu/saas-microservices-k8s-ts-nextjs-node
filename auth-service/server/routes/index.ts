import { Router } from "express"

import middleware from "../middleware"
import { Controller } from "../controllers"
import services from "../services"

const router = Router()

const { catchAsyncError } = services.error

router.post(
  "/signup",
  middleware.auth.checkRequiredSignUpFields,
  middleware.auth.handleValidationResults,
  middleware.auth.checkDuplicateEmail,
  catchAsyncError(Controller.Auth.signUpUser)
)

router.get(
  "/me",
  middleware.auth.validateRequiredAccessJwt,
  middleware.auth.checkIsAuthenticated,
  catchAsyncError(Controller.Auth.getUserInfo)
)

router.post("/login", catchAsyncError(Controller.Auth.loginUser))

router.get(
  "/logout",
  middleware.auth.validateRequiredAccessJwt,
  middleware.auth.checkIsAuthenticated,
  catchAsyncError(Controller.Auth.logoutUser)
)

router.patch(
  "/update",
  middleware.auth.validateRequiredAccessJwt,
  middleware.auth.checkIsAuthenticated,
  catchAsyncError(Controller.Auth.updateUser)
)

router.delete(
  "/delete",
  middleware.auth.validateRequiredAccessJwt,
  middleware.auth.checkIsAuthenticated,
  catchAsyncError(Controller.Auth.deleteUser)
)

router.get(
  "/token/:refreshToken",
  middleware.auth.validateRequiredRefreshJwt,
  catchAsyncError(Controller.Auth.getRefreshToken)
)

export default router
