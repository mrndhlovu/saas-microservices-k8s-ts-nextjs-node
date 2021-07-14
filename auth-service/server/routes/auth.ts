import { Router } from "express"

import Validator from "../middleware"
import { Controller } from "../controllers"
import Services from "../services"

const router = Router()

const { catchAsyncError } = Services.error

const authRoutes = () => {
  router.post(
    "/signup",
    Validator.auth.checkDuplicateEmail,
    catchAsyncError(Controller.Auth.signUpUser)
  )

  router.get(
    "/me",
    Validator.auth.validateRequiredAccessJwt,
    Validator.auth.checkIsAuthenticated,
    catchAsyncError(Controller.Auth.getUserInfo)
  )

  router.post("/login", catchAsyncError(Controller.Auth.loginUser))

  router.get(
    "/logout",
    Validator.auth.validateRequiredAccessJwt,
    Validator.auth.checkIsAuthenticated,
    catchAsyncError(Controller.Auth.logoutUser)
  )

  router.patch(
    "/update",
    Validator.auth.validateRequiredAccessJwt,
    Validator.auth.checkIsAuthenticated,
    catchAsyncError(Controller.Auth.updateUser)
  )

  router.delete(
    "/delete",
    Validator.auth.validateRequiredAccessJwt,
    Validator.auth.checkIsAuthenticated,
    catchAsyncError(Controller.Auth.deleteUser)
  )

  router.get(
    "/token/:refreshToken",
    Validator.auth.validateRequiredRefreshJwt,
    catchAsyncError(Controller.Auth.getRefreshToken)
  )

  return router
}

export default authRoutes
