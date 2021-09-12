import { Router } from "express"

import { authMiddleware, errorService } from "@tusksui/shared"

import { accountController } from "../controllers"
import { accountMiddleware } from "../middleware/account"

const router = Router()

router.get(
  "/all",
  authMiddleware.validateRequiredAccessJwt,
  authMiddleware.checkIsAuthenticated,
  errorService.catchAsyncError(accountController.getAccounts)
)

router.get(
  "/create",
  errorService.catchAsyncError(accountController.createAccount)
)

router.get(
  "/power-ups",
  authMiddleware.validateRequiredAccessJwt,
  authMiddleware.checkIsAuthenticated,
  errorService.catchAsyncError(accountController.getPowerUp)
)

router.get(
  "/verify/:token",
  accountMiddleware.validateVerificationJwt,
  errorService.catchAsyncError(accountController.verifyAccount)
)

router
  .route("/")
  .get(
    authMiddleware.validateRequiredAccessJwt,
    authMiddleware.checkIsAuthenticated,
    accountMiddleware.checkAccountPlan,
    errorService.catchAsyncError(accountController.getAccountById)
  )
  .patch(
    accountMiddleware.checkRequiredBodyFields,
    accountMiddleware.validateRequestBodyFields,
    authMiddleware.validateRequiredAccessJwt,
    authMiddleware.checkIsAuthenticated,
    accountMiddleware.checkAccountPlan,
    errorService.catchAsyncError(accountController.updateAccount)
  )

export { router as accountRoutes }
